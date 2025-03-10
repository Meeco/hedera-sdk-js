# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v2.0.17-beta.2

### Added

 * Support for setting signatures on the underlying scheduled transaction
 * `TransactionReceipt.scheduledTransactionId`
 * `ScheduleInfo.scheduledTransactionId`
 * `TransactionRecord.scheduleRef`
 * Support for scheduled and nonce in `TransactionId`
   * `TransactionId.withNonce()` - Supports creating transaction ID with random bytes.
   * `TransactionId.[set|get]Scheduled()` - Supports scheduled transaction IDs.
 * `memo` fields for both create and update transactions and info queries
   * `Account[Create|Update]Transaction.[set|get]AccountMemo()`
   * `File[Create|Update]Transaction.[set|get]AccountMemo()`
   * `Token[Create|Update]Transaction.[set|get]AccountMemo()`
   * `AccountInfoQuery.accountMemo`
   * `FileInfoQuery.fileMemo`
   * `TokenInfoQuery.tokenMemo`

### Fixed

 * `ScheduleInfo.*ID` field names should use `Id`
   Ex. `ScheduleInfo.creatorAccountID` -> `ScheduleInfo.creatorAccountId`
 * Renamed `ScheduleInfo.memo` -> `ScheduleInfo.scheduleMemo`
 * Chunked transactions should not support scheduling if the data provided is too large
   * `TopicMessageSubmitTransaction` 
   * `FileAppendTransaction`

## v2.0.17-beta.1

### Added

 * Support for scheduled transactions.
   * `ScheduleCreateTransaction` - Create a new scheduled transaction
   * `ScheduleSignTransaction` - Sign an existing scheduled transaction on the network
   * `ScheduleDeleteTransaction` - Delete a scheduled transaction
   * `ScheduleInfoQuery` - Query the info including `bodyBytes` of a scheduled transaction
   * `ScheduleId`

### Fixed

 * `KeyList.toString()`
 * `AccountBalance.toString()`

### Deprecated

 * `new TransactionId(AccountId, Instant)` - Use `TransactionId.withValidStart()` instead.

## v2.0.15

### Added
 * Implement `Client.forName()` to support construction of client from network name.
 * Implement `PrivateKey.verifyTransaction()` to allow a user to verify a transaction was signed with a partiular key.

## v2.0.14

### General Changes
    * All queries and transactions support setting fields in the constructor using
      an object, e.g. `new AccountBalanceQuery({ accountId: "0.0.3" })`, or
      `new AccountCreateTransaction({ key: client.operatorPublicKey, initialBalance: 10 })`.
    * Almost all instances of `BigNumber` have been replaced with `Long`

## v1.1.12

### Fixed

 * `Ed25519PrivateKey.fromMnemonic` regressed in v1.1.8 and was not working in the browser.
 
 * Use detached signatures when signing the transaction. This should allow for much larger transactions to be submitted.

## v1.1.11

### Fixed

 * `Ed25519PrivateKey.fromKeystore` regressed in v1.1.9 and was not working in the browser

## v1.1.10

### Added

  * `Client.ping(id: AccountIdLike)` Pings a node by account ID.

  * `Ed25519PrivateKey.fromMnemonic` works with legacy 22-word phrases.

### Deprecated

  * `Client.getAccountBalance()` to match the Java SDK. Use `AccountBalanceQuery` directly instead.

## v1.1.9

### Added

 * Allow BigNumber or String to be used as Tinybar where Tinybar was accepted

 * Add support for decoding `Ed25519PrivateKey` from a PEM file using `Ed25519PrivateKey.fromPem()`

 * Add support for passing no argument to `ContractFunctionResult.get*()` methods.

 * Add `MnemonicValidationResult` which is the response type for `Mnemonic.validte()`

 * Add public method `Mnemonic.validate(): MnemonicValidationResult` which validates if the mnemonic
   came from the same wordlist, in the right order, and without misspellings.

 * Add `BadPemFileError` which is thrown when decoding a pem file fails.

### Fixed

 * Fixes `AddBytes32Array`

 * Fixes `Hbar.isNegative()` failing with `undefined`.

 * Fixes `CryptoTransferTransaction.addTransfer()` not supporting `BigNumber` or
   `number` as arguments.

 * Fixes `ConsensusTopicInfoQuery.setTopicId()` not supporting `ConsensusTopicIdLike`.

### Deprecated

 * Deprecates `Client.maxTransactionFee` and `Client.maxQueryPayment` getters.

 * Deprecates `ConsensusTopicCreateTransaction.setAutoRenewAccount()` was simply
   renamed to `ConsensusTopicCreateTransaction.setAutoRenewAccountId()`.

 * Deprecates `ConsensusTopicCreateTransaction.setExpirationTime()` with no replacement.

 * Deprecates `ConsensusTopicCreateTransaction.setValidStart()` with no replacement.

 * Deprecates `ConsensusTopicUpdateTransaction.setAutoRenewAccount()` with no replacement.

## v1.1.8

### Fixed

 * `TransactionRecord.getContractCallResult` and `TransactionRecord.getContractExecuteResult` were swapped
    internally and neither worked before.

 * Export `ConsensusMessageSubmitTransaction`.

## v1.1.7

### Fixed

 * Do not provide (and sign) a payment transaction for `AccountBalanceQuery`. It is not required.

## v1.1.6

### Added

 * Add `TransactionBuilder.getCost()` to return a very close estimate of the transaction fee (within 1%).

 * Add additional error classes to allow more introspection on errors:
    * `HederaPrecheckStatusError` - Thrown when the transaction fails at the node (the precheck)
    * `HederaReceiptStatusError` - Thrown when the receipt is checked and has a failing status. The error object contains the full receipt.
    * `HederaRecordStatusError` - Thrown when the record is checked and it has a failing status. The error object contains the full record.

 * `console.log(obj)` now prints out nice debug information for several types in the SDK including receipts

## v1.1.5

### Added

 * Add `TransactionReceipt.getConsensusTopicId()`.

 * Add `TransactionReceipt.getConsensusTopicRunningHash()`.

 * Add `TransactionReceipt.getConsensusTopicSequenceNumber()`.

 * Adds support for addresses with a leading `0x` prefix with `ContractFunctionParams.addAddress()`.

### Deprecated

 * Deprecates `Client.putNode()`. Use `Client.replaceNodes()` instead.

 * Depreactes `Transaction.getReceipt()` and `Transaction.getRecord()`. Use `TransactionId.getReceipt()` or
   `TransactionId.getRecord()` instead. The `execute` method on `Transaction` returns a `TransactionId`.

 * Deprecates `ConsensusSubmitMessageTransaction`. This was renamed to `ConsensusMessageSubmitTransaction` to
   match the Java SDK.

## v1.1.2

### Fixed

 * https://github.com/hashgraph/hedera-sdk-js/issues/175

## v1.1.1

### Fixed

 * `RECEIPT_NOT_FOUND` is properly considered and internally retried within `TransactionReceiptQuery`

## v1.1.0

### Fixed

 * Contract parameter encoding with BigNumbers

### Added

Add support for Hedera Consensus Service (HCS).

 * Add `ConsensusTopicCreateTransaction`, `ConsensusTopicUpdateTransaction`, `ConsensusTopicDeleteTransaction`, and `ConsensusMessageSubmitTransaction` transactions

 * Add `ConsensusTopicInfoQuery` query (returns `ConsensusTopicInfo`)

 * Add `MirrorClient` and `MirrorConsensusTopicQuery` which can be used to listen for HCS messages from a mirror node.

### Changed

Minor version bumps may add deprecations as we improve parity between SDKs
or fix reported issues. Do not worry about upgrading in a timely manner. All v1+ APIs
will be continuously supported.

 * Deprecated `SystemDelete#setId`; replaced with `SystemDelete#setFileId` or `SystemDelete#setContractId`

 * Deprecated `SystemUndelete#setId`; replaced with `SystemUndelete#setFileId` or `SystemUndelete#setContractId`

 * Deprecated `Hbar.of(val)`; replaced with `new Hbar(val)`

 * Deprecated `FreezeTransaction#setStartTime(Date)`; replaced with `FreezeTransaction#setStartTime(hour: number, minute: number)`

 * Deprecated `FreezeTransaction#setEndTime(Date)`; replaced with `FreezeTransaction#setEndTime(hour: number, minute: number)`

 * All previous exception types are no longer thrown. Instead there are a set of new exception types to match the Java SDK.

   * `HederaError` becomes `HederaStatusError`
   * `ValidationError` becomes `LocalValidationError`
   * `TinybarValueError` becomes `HbarRangeError`
   * `MaxPaymentExceededError` becomes `MaxQueryPaymentExceededError`
   * `BadKeyError` is a new exception type when attempting to parse or otherwise use a key that doesn't look like a key

## v1.0.1

### Added

 * Allow passing a string for a private key in `Client.setOperator`

### Fixed

 * Correct list of testnet node addresses

## v1.0.0

No significant changes since v1.0.0-beta.5

## v1.0.0-beta.5

### Fixed

 * Fix `getCost` for entity Info queries where the entity was deleted

### Added

 * Add support for unsigned integers (incl. Arrays) for contract encoding and decoding

 * Add `AccountUpdateTransaction.setReceiverSignatureRequired`

 * Add `AccountUpdateTransaction.setProxyAccountId`

### Changed

 * Rename `ContractExecuteTransaction.setAmount()` to `ContractExecuteTransaction.setPayableAmount()`

## v1.0.0-beta.4

### Added

 * `Client.forTestnet` makes a new client configured to talk to TestNet (use `.setOperator` to set an operater)

 * `Client.forMainnet` makes a new client configured to talk to Mainnet (use `.setOperator` to set an operater)

### Changed

 * Renamed `TransactionReceipt.accountId`, `TransactionReceipt.contractId`, `TransactionReceipt.fileId`, and
   `TransactionReceipt.contractId` to `TransactionReceipt.getAccountId()`, etc. to add an explicit illegal
   state check as these fields are mutually exclusive

 * Renamed `TransactionRecord.contractCallResult` to `TransactionRecord.getContractExecuteResult()`

 * Renamed `TransactionRecord.contractCreateResult` to `TransactionRecord.getContractCreateResult()`

## v1.0.0-beta.3

### Changed

 * `TransactionBuilder.setMemo` is renamed to `TransactionBuilder.setTransactionMemo` to avoid confusion
   as there are 2 other kinds of memos on transactions

### Fixed

 * Fix usage on Node versions less than 12.x

## v1.0.0-beta.2

### Changed

 * `CallParams` is removed in favor of `ContractFunctionParams` and closely mirrors type names from solidity
    * `addInt32`
    * `addInt256Array`
    * `addString`
    * etc.

 * `ContractFunctionResult` now closely mirrors the solidity type names
   * `getInt32`
   * etc.

 * `setFunctionParams(params)` on `ContractCallQuery` and `ContractExecuteTransaction` is now
   `setFunction(name, params)`

 * `ContractLogInfo.topicList` -> `ContractLogInfo.topics`

 * `FileInfo.deleted` -> `FileInfo.isDeleted`

 * `FileContentsQuery.execute` now directly returns `Uint8Array`

 * `ContractRecordsQuery.execute` now directly returns `TransactionRecord[]`

 * `AccountAmount.amount` (`String`) -> `AccountAmount.amount` (`Hbar`)

 * TransactionReceipt
    * `receiverSigRequired` -> `isReceiverSignatureRequired`
    * `autoRenewPeriodSeconds` -> `autoRenewPeriod`

### Fixed

 * Remove incorrect local validation for FileCreateTransaction and FileUpdateTransaction

 * Any `key` fields on response types (e.g., `AccountInfo`) are
   now `PublicKey` and can be any of the applicable key types

 * Fix transaction back-off when BUSY is returned

 * Default autoRenewPeriod on ContractCreate appropriately

## v0.8.0-beta.3

### Changed

 * Client constructor takes the network as `{ network: ... }` instead of `{ nodes: ... }`

 * Transactions and queries do not take `Client` in the constructor; instead, `Client` is passed to `execute`.

 * Removed `Transaction.executeForReceipt` and `Transaction.executeForRecord`

    These methods have been identified as harmful as they hide too much. If one fails, you do not know if the transaction failed to execute; or, the receipt/record could not be retrieved. In a mission-critical application, that is, of course, an important distinction.

    Now there is only `Transaction.execute` which returns a `TransactionId`. If you don't care about waiting for consensus or retrieving a receipt/record in your application, you're done. Otherwise you can now use any `TransactionId` and ask for the receipt/record (with a stepped retry interval until consensus) with `TransactionId.getReceipt` and `TransactionId.getRecord`.

    v0.7.x and below

    ```js
    let newAccountId = new AccountCreateTransaction(hederaClient)
        .setKey(newKey.publicKey)
        .setInitialBalance(1000)
        .executeForReceipt() // TransactionReceipt
        .accountId;
    ```

    v0.8.x and above

    ```js
    let newAccountId = new AccountCreateTransaction()
        .setKey(newKey.publicKey)
        .setInitialBalance(1000)
        .execute(hederaClient) // TranactionId
        .getReceipt(hederaClient) // TransactionReceipt
        .accountId;
    ```

 * Rename `setPaymentDefault` to `setPaymentAmount`

### Added

 * All transaction and query types that were in the Java SDK but not yet in the JS SDK (GetBySolidityIdQuery, AccountStakersQuery, etc.)

 * `TransactionId.getReceipt`

 * `TransactionId.getRecord`

 * `Transaction.toString`. This will dump the transaction (incl. the body) to a stringified JSON object representation of the transaction. Useful for debugging.

 * A default of 1 Hbar is now set for both maximum transaction fees and maximum query payments.

 * Smart Contract type encoding and decoding to match Java.

 * To/From string methods on AccountId, FileId, etc.

 * Internal retry handling for Transactions and Queries (incl. BUSY)

### Removed

 * `Transaction` and `Query` types related to claims
