export function displayWalletAddress(walletAddress) {
    if (typeof walletAddress === 'string' && walletAddress.length === 42 && walletAddress.startsWith("0x")) {
        return walletAddress.substring(0, 6) + "..." + walletAddress.substring(walletAddress.length - 4);
    } else {
        return "";
    }
}