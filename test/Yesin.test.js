const Yesin = artifacts.require("Yesin")

contract("Yesin", (accounts) => {

    before(async () => {
        token = await Yesin.deployed()
    })

    it("has a name", async () => {
        let name = token.name()
        console.log(name) 
    })

    it("gives the owner of the token 400 tokens", async () => {
        let balance = await token.balanceOf(accounts[0])
        balance = web3.utils.fromWei(balance, 'wei') 
        assert.equal(balance, 400, "Balance should be 400 tokens for creator")
    })

    it("amount of tokens in existence multiplied by 100", async () => {
        let expectation = 40000
        let amount = await token.balanceOf(accounts[0])
        amount = web3.utils.fromWei(amount, 'wei')
        assert.equal(expectation, amount * 100, "Amount should be 400k")
    })

    it("can transfer tokens betwen accounts", async () => {
        let amount = web3.utils.toWei('200', 'wei')
        await token.transfer(accounts[1], amount, { from: accounts[0]  })

        let balance = await token.balanceOf(accounts[1])
        balance = web3.utils.fromWei(balance, 'wei') 
        assert.equal(balance, 200, "Balance should be 200 tokens for creator")
    })
})
