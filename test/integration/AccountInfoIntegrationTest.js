import {
    AccountCreateTransaction,
    AccountDeleteTransaction,
    AccountInfoQuery,
    Hbar,
    Status,
    TransactionId,
    TokenCreateTransaction,
    TokenAssociateTransaction,
    PrivateKey,
} from "../src/exports.js";
import newClient from "./client/index.js";

describe("AccountInfo", function () {
    it("should be able to query cost", async function () {
        this.timeout(15000);

        const client = await newClient();
        const operatorId = client.operatorAccountId;

        const cost = await new AccountInfoQuery()
            .setAccountId(operatorId)
            .getCost(client);

        expect(cost.toTinybars().toInt()).to.be.at.least(25);
    });

    it("should be executable", async function () {
        this.timeout(15000);

        const client = await newClient();
        const operatorId = client.operatorAccountId;
        const key = PrivateKey.generate();

        const response = await new AccountCreateTransaction()
            .setKey(key.publicKey)
            .setInitialBalance(new Hbar(2))
            .execute(client);

        const receipt = await response.getReceipt(client);

        expect(receipt.accountId).to.not.be.null;
        const account = receipt.accountId;

        const info = await new AccountInfoQuery()
            .setNodeAccountIds([response.nodeId])
            .setAccountId(account)
            .execute(client);

        expect(info.accountId.toString()).to.be.equal(account.toString());
        expect(info.isDeleted).to.be.false;
        expect(info.key.toString()).to.be.equal(key.publicKey.toString());
        expect(info.balance.toTinybars().toInt()).to.be.equal(
            new Hbar(2).toTinybars().toInt()
        );
        expect(info.autoRenewPeriod.seconds.toNumber()).to.be.equal(7776000);
        expect(info.proxyAccountId).to.be.null;
        expect(info.proxyReceived.toTinybars().toInt()).to.be.equal(0);

        await (
            await (
                await new AccountDeleteTransaction()
                    .setAccountId(account)
                    .setNodeAccountIds([response.nodeId])
                    .setTransferAccountId(operatorId)
                    .setTransactionId(TransactionId.generate(account))
                    .freezeWith(client)
                    .sign(key)
            ).execute(client)
        ).getReceipt(client);
    });

    it("should be able to get 300 accounts", async function () {
        this.timeout(150000000);

        const client = await newClient();
        const operatorId = client.operatorAccountId;
        const key = PrivateKey.generate();
        let response = [];
        let receipt = [];
        let info = [];

        for (let i = 0; i < 300; i++) {
            response[i] = await new AccountCreateTransaction()
                .setKey(key.publicKey)
                .setInitialBalance(new Hbar(2))
                .execute(client);
        }

        for (let i = 0; i < 300; i++) {
            receipt[i] = await response[i].getReceipt(client);
        }

        for (let i = 0; i < 300; i++) {
            info[i] = await new AccountInfoQuery()
                .setNodeAccountIds([response[i].nodeId])
                .setAccountId(receipt[i].accountId)
                .execute(client);

            console.log(info[i].accountId);
        }

        for (let i = 0; i < 300; i++) {
            await (
                await (
                    await new AccountDeleteTransaction()
                        .setAccountId(receipt[i].accountId)
                        .setNodeAccountIds([response[i].nodeId])
                        .setTransferAccountId(operatorId)
                        .setTransactionId(
                            TransactionId.generate(receipt[i].accountId)
                        )
                        .freezeWith(client)
                        .sign(key)
                ).execute(client)
            ).getReceipt(client);
        }
    });

    it("should reflect token with no keys", async function () {
        this.timeout(10000);

        const client = await newClient(true);
        const operatorId = client.operatorAccountId;
        const key = PrivateKey.generate();

        let response = await new AccountCreateTransaction()
            .setKey(key)
            .setInitialBalance(new Hbar(2))
            .execute(client);

        const account = (await response.getReceipt(client)).accountId;

        response = await new TokenCreateTransaction()
            .setTokenName("ffff")
            .setTokenSymbol("F")
            .setTreasuryAccountId(operatorId)
            .execute(client);

        const token = (await response.getReceipt(client)).tokenId;

        await (
            await (
                await new TokenAssociateTransaction()
                    .setTokenIds([token])
                    .setAccountId(account)
                    .freezeWith(client)
                    .sign(key)
            ).execute(client)
        ).getReceipt(client);

        const info = await new AccountInfoQuery()
            .setAccountId(account)
            .execute(client);

        const relationship = info.tokenRelationships.get(token);

        expect(relationship).to.be.not.null;
        expect(relationship.tokenId.toString()).to.be.equal(token.toString());
        expect(relationship.balance.toInt()).to.be.equal(0);
        expect(relationship.isKycGranted).to.be.null;
        expect(relationship.isFrozen).to.be.null;
    });

    it("should be error with no account ID", async function () {
        this.timeout(15000);

        const client = await newClient();
        let err = false;

        try {
            await new AccountInfoQuery().execute(client);
        } catch (error) {
            err = error.toString().includes(Status.InvalidAccountId.toString());
        }

        if (!err) {
            throw new Error("query did not error");
        }
    });
});
