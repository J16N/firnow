import asyncio
from typing import Annotated, Optional, cast

from fastapi import APIRouter, BackgroundTasks, Body, Depends, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from tortoise.exceptions import DoesNotExist

from config import settings
from databases.redis import RedisClient
from dependencies.auth import get_police_station
from models.auth import (
    InvalidOtp,
    InvalidOtpResponse,
    OtpRequest,
    ResetPasswordPayload,
    SentOtp,
    SentOtpResponse,
    VerifiedOtpResponse,
)
from models.errors import (
    ErrorMessage,
    PoliceStationNotFound,
    RequestError,
    RequestErrorWithAction,
    RequestErrorWithRedirect,
)
from models.police_station import (
    PoliceStation_Pydantic,
    PoliceStationRegistrationResponse,
    PoliceStationRequest,
    PoliceStationResponse,
)
from models.tables import PoliceStation
from routes.police_station_urls import *
from utils.id import get_id
from utils.mail import (
    send_otp_message,
    send_reset_password_message,
    send_welcome_message,
)
from utils.otp import generate_otp, send_otp
from utils.password import encrypt, verify_password
from utils.token import get_access_token_obj

router = APIRouter(
    prefix=f"/{prefix}", tags=["Police Station Authentication Endpoints"]
)


async def authenticate_police(email: str, password: str) -> Optional[PoliceStation]:
    police_station = await PoliceStation.get_or_none(email=email)
    if police_station is None:
        raise PoliceStationNotFound

    matched = await asyncio.to_thread(
        verify_password, password, police_station.password
    )
    return police_station if matched else None


@router.post(
    "/register",
    summary="Register a new police station",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_201_CREATED: {
            "description": "Successful Response",
            "model": PoliceStationRegistrationResponse,
        },
        status.HTTP_409_CONFLICT: {
            "description": "Duplicate Entity Error",
            "model": RequestErrorWithRedirect,
        },
    },
)
async def register_police_station(
    response: Response, payload: Annotated[PoliceStationRequest, Body()]
):
    """
    Register a new police station. The request body should contain the following fields:
    - **name:** Name of the police station
    - **email:** Email ID of the police station
    - **password:** Password to be set for the police station
    - **state:** Name of the state where the police station is located
    - **district:** Name of the district where the police station is located
    - **wallet:** Wallet address of the police station

    **Example:**
    ```
    {
        "name": "Example Thana",
        "email": "example.thana@gov.in",
        "password": "1234567Aa@",
        "state": "West Bengal",
        "district": "Hooghly",
        "wallet": "0x1234567890abcdef"
    }
    ```
    """
    # check if the email id already exists
    if await PoliceStation.exists(email=payload.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": "Police station already exists",
                "redirect": str(LOGIN_URL),
            },
        )

    id = await get_id()
    police_station_req = payload.model_dump(exclude_unset=True)
    police_station_req["id"] = id
    police_station_req["password"] = await asyncio.to_thread(
        encrypt, police_station_req["password"]
    )
    result = await PoliceStation.create(**police_station_req)

    police_station_resp = await PoliceStation_Pydantic.from_tortoise_orm(result)
    access_token_obj = await get_access_token_obj(result.id, response)

    otp_resp = await send_otp(SEND_OTP_URL, access_token_obj.access_token)

    return PoliceStationRegistrationResponse(
        **access_token_obj.model_dump(),
        police_station=cast(PoliceStation_Pydantic, police_station_resp),
        redirect=otp_resp.action.verifyOtp,
    )


@router.post(
    "/login",
    summary="Login to an existing police station account",
    responses={
        status.HTTP_200_OK: {
            "description": "Successful Response",
            "model": PoliceStationResponse,
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Invalid Credentials",
            "model": RequestError,
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Account Retrieval Error",
            "model": RequestErrorWithRedirect,
        },
    },
)
async def login_police_station(
    response: Response, form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Login to an existing police station account. The request payload should be sent as a
    form data with the following fields:
    - **username:** Email ID of the police station
    - **password:** Password of the police station

    The `accessToken` received in the response should be used as a ***bearer token*** while making
    request to the protected endpoints.
    """
    try:
        police_station = await authenticate_police(
            form_data.username, form_data.password
        )

        if police_station is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "message": "Incorrect email or password",
                },
            )
        access_token_obj = await get_access_token_obj(police_station.id, response)
        successful_resp = PoliceStationResponse(
            **access_token_obj.model_dump(),
            redirect=POLICE_STATION_DASHBOARD_URL,
        )

        if not police_station.verified:
            otp_resp = await send_otp(SEND_OTP_URL, access_token_obj.access_token)
            successful_resp.redirect = otp_resp.action.verifyOtp
            return successful_resp

        return successful_resp

    except PoliceStationNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "message": "Police Station with the provided email is not present",
                "redirect": str(REGISTER_URL),
            },
        )


@router.post(
    "/verify-email",
    summary="Verify the police station email",
    responses={
        status.HTTP_200_OK: {
            "description": "Successful Response",
            "model": VerifiedOtpResponse,
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "OTP Verification Failed",
            "model": RequestErrorWithAction,
        },
    },
)
async def verify_police_station_email(
    unverified: Annotated[PoliceStation, Depends(get_police_station)],
    body: OtpRequest,
    background_tasks: BackgroundTasks,
):
    """
    Verify the police station email. The request body should contain the following fields:
    - **otp:** OTP sent to the police station email

    **Example:**
    ```
    {
        "otp": "123456"
    }
    ```
    """
    if unverified.verified:
        return VerifiedOtpResponse(
            message="Email is already verified",
            redirect=POLICE_STATION_DASHBOARD_URL,
        )

    detail = InvalidOtpResponse(
        message="OTP is not valid",
        action=InvalidOtp(sendOtp=SEND_OTP_URL),
    )

    redis = await RedisClient.get_client()
    otp = await redis.get(f"otp:{unverified.id}")

    if not otp:
        detail.message = "OTP has expired"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=jsonable_encoder(detail, exclude_unset=True),
        )

    if otp == body.otp:
        await redis.delete(f"otp:{unverified.id}")
        await PoliceStation.select_for_update().filter(id=unverified.id).update(
            verified=True
        )

        background_tasks.add_task(send_welcome_message, unverified.email)

        return VerifiedOtpResponse(
            message="Email verified successfully",
            redirect=POLICE_STATION_DASHBOARD_URL,
        )

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=jsonable_encoder(detail, exclude_unset=True),
    )


@router.get(
    "/send-otp",
    summary="Send OTP to the police station email",
    responses={
        status.HTTP_200_OK: {
            "description": "Successful Response",
            "model": SentOtpResponse,
        },
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Invalid Credentials",
            "model": RequestErrorWithRedirect,
        },
        status.HTTP_404_NOT_FOUND: {
            "description": "Account Retrieval Error",
            "model": RequestError,
        },
    },
)
async def send_otp_police_station(
    unverified: Annotated[PoliceStation, Depends(get_police_station)],
    background_tasks: BackgroundTasks,
):
    """
    Send OTP to the email address associated with the police station account.
    This is a protected endpoint and requires the `accessToken` to be sent as a ***bearer token***.
    """
    if unverified.verified:
        return VerifiedOtpResponse(
            message="Email is already verified",
            redirect=POLICE_STATION_DASHBOARD_URL,
        )

    otp = generate_otp(6)

    # send otp to email
    background_tasks.add_task(send_otp_message, unverified.email, otp)

    redis = await RedisClient.get_client()
    await redis.set(f"otp:{unverified.id}", otp, ex=60 * 5)
    return SentOtpResponse(
        message="OTP sent successfully",
        action=SentOtp(verifyOtp=VERIFY_EMAIL_URL),
    )


@router.post(
    "/send-reset-password-link",
    tags=["General Authentication Endpoints"],
    summary="Reset password",
    responses={
        status.HTTP_200_OK: {
            "description": "Successful Response",
            "model": ErrorMessage,
        },
    },
)
async def reset_password(
    response: Response,
    payload: Annotated[ResetPasswordPayload, Body()],
    background_tasks: BackgroundTasks,
):
    try:
        police_station = await PoliceStation.get(email=payload.email)
        token_obj = await get_access_token_obj(police_station.id, response)
        url: str = f"{RESET_PASSWORD_URL}?token={token_obj.access_token}"
        background_tasks.add_task(
            send_reset_password_message,
            police_station.email,
            police_station.name,
            url,
        )

        redis = await RedisClient.get_client()
        await redis.set(f"reset_password:{token_obj.access_token}", 1, ex=24 * 60 * 60)

    except DoesNotExist:
        pass

    return {"message": "If the email exists, a reset password link will been sent"}
