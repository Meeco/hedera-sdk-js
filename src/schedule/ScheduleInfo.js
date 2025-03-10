import ScheduleId from "./ScheduleId.js";
import AccountId from "../account/AccountId.js";
import {
    keyFromProtobuf,
    keyToProtobuf,
    keyListFromProtobuf,
    keyListToProtobuf,
} from "../cryptography/protobuf.js";
import Timestamp from "../Timestamp.js";
import Transaction from "../transaction/Transaction.js";
import {
    SignedTransaction as ProtoSignedTransaction,
    TransactionList as ProtoTransactionList,
} from "@hashgraph/proto";
import TransactionId from "../transaction/TransactionId.js";

/**
 * @namespace proto
 * @typedef {import("@hashgraph/proto").IScheduleInfo} proto.IScheduleInfo
 * @typedef {import("@hashgraph/proto").IScheduleID} proto.IScheduleID
 * @typedef {import("@hashgraph/proto").ITimestamp} proto.ITimestamp
 * @typedef {import("@hashgraph/proto").IAccountID} proto.IAccountID
 * @typedef {import("@hashgraph/proto").IKey} proto.IKey
 * @typedef {import("@hashgraph/proto").IDuration} proto.IDuration
 */

/**
 * @typedef {import("@hashgraph/cryptography").Key} Key
 * @typedef {import("@hashgraph/cryptography").KeyList} KeyList
 */

/**
 * Response when the client sends the node ScheduleGetInfoQuery.
 */
export default class ScheduleInfo {
    /**
     * @private
     * @param {object} props
     * @param {ScheduleId} props.scheduleId;
     * @param {?AccountId} props.creatorAccountID;
     * @param {?AccountId} props.payerAccountID;
     * @param {?Uint8Array} props.transactionBody;
     * @param {?Key} props.adminKey
     * @param {?KeyList} props.signatories;
     * @param {?string} props.scheduleMemo;
     * @param {?Timestamp} props.expirationTime;
     * @param {?TransactionId} props.scheduledTransactionId;
     */
    constructor(props) {
        /**
         *
         * @readonly
         */
        this.scheduleId = props.scheduleId;

        /**
         *
         * @readonly
         */
        this.creatorAccountId = props.creatorAccountID;

        /**
         *
         * @readonly
         */
        this.payerAccountId = props.payerAccountID;

        /**
         *
         * @readonly
         */
        this.transactionBody = props.transactionBody;

        /**
         *
         * @readonly
         */
        this.signatories = props.signatories;

        /**
         *
         * @readonly
         */
        this.scheduleMemo = props.scheduleMemo;

        /**
         *
         * @readonly
         */
        this.adminKey = props.adminKey != null ? props.adminKey : null;

        /**
         *
         * @readonly
         */
        this.expirationTime = props.expirationTime;

        this.scheduledTransactionId = props.scheduledTransactionId;
    }

    /**
     * @internal
     * @param {proto.IScheduleInfo} info
     * @returns {ScheduleInfo}
     */
    static _fromProtobuf(info) {
        return new ScheduleInfo({
            scheduleId: ScheduleId._fromProtobuf(
                /** @type {proto.IScheduleID} */ (info.scheduleID)
            ),
            creatorAccountID:
                info.creatorAccountID != null
                    ? AccountId._fromProtobuf(
                          /** @type {proto.IAccountID} */ (info.creatorAccountID)
                      )
                    : null,
            payerAccountID:
                info.payerAccountID != null
                    ? AccountId._fromProtobuf(
                          /** @type {proto.IAccountID} */ (info.payerAccountID)
                      )
                    : null,
            transactionBody:
                info.transactionBody != null ? info.transactionBody : null,
            adminKey:
                info.adminKey != null ? keyFromProtobuf(info.adminKey) : null,
            signatories:
                info.signatories != null
                    ? keyListFromProtobuf(info.signatories)
                    : null,
            scheduleMemo: info.memo != null ? info.memo : null,
            expirationTime:
                info.expirationTime != null
                    ? Timestamp._fromProtobuf(
                          /** @type {proto.ITimestamp} */ (info.expirationTime)
                      )
                    : null,
            scheduledTransactionId:
                info.scheduledTransactionID != null
                    ? TransactionId._fromProtobuf(info.scheduledTransactionID)
                    : null,
        });
    }

    /**
     * @returns {proto.IScheduleInfo}
     */
    _toProtobuf() {
        return {
            scheduleID:
                this.scheduleId != null ? this.scheduleId._toProtobuf() : null,
            creatorAccountID:
                this.creatorAccountId != null
                    ? this.creatorAccountId._toProtobuf()
                    : null,
            payerAccountID:
                this.payerAccountId != null
                    ? this.payerAccountId._toProtobuf()
                    : null,
            transactionBody:
                this.transactionBody != null
                    ? this.transactionBody
                    : new Uint8Array(0),
            adminKey:
                this.adminKey != null ? keyToProtobuf(this.adminKey) : null,
            signatories:
                this.signatories != null
                    ? keyListToProtobuf(this.signatories)
                    : null,
            memo: this.scheduleMemo != null ? this.scheduleMemo : "",
            expirationTime:
                this.expirationTime != null
                    ? this.expirationTime._toProtobuf()
                    : null,
            scheduledTransactionID:
                this.scheduledTransactionId != null
                    ? this.scheduledTransactionId._toProtobuf()
                    : null,
        };
    }

    /**
     * @returns {Transaction}
     */
    get transaction() {
        return Transaction.fromBytes(
            ProtoTransactionList.encode({
                transactionList: [
                    {
                        signedTransactionBytes: ProtoSignedTransaction.encode({
                            bodyBytes:
                                this.transactionBody != null
                                    ? this.transactionBody
                                    : new Uint8Array(),
                        }).finish(),
                    },
                ],
            }).finish()
        );
    }
}
