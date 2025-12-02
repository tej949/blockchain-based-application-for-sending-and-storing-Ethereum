const main = async () => {
    const Transactions = await hre.ethers.getContractFactory("Transactions");
    // ethers v6: deploy() returns a contract instance and you should use
    // waitForDeployment() and getAddress() instead of deployed() and .address
    const transactions = await Transactions.deploy();
    await transactions.waitForDeployment();
    console.log("Transactions deployed to:", await transactions.getAddress());
}
const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
runMain();
