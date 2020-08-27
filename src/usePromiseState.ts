import {promiseStatuses} from "@mgtitimoli/utils-promise/dist/promiseStatus";

type FulfilledUsePromiseState<TResult> = {
  result: TResult;
  status: typeof promiseStatuses.fulfilled;
};

type RejectedUsePromiseState = {
  error: Error;
  status: typeof promiseStatuses.rejected;
};

type PendingUsePromiseState = {
  status: typeof promiseStatuses.pending;
};

type IdleUsePromiseState = {
  status: typeof promiseStatuses.idle;
};

// We are calling this UsePromiseState and not just State to communicate better
// the result to the user
type UsePromiseState<TResult> =
  | IdleUsePromiseState
  | PendingUsePromiseState
  | RejectedUsePromiseState
  | FulfilledUsePromiseState<TResult>;

const createRejected = (error: Error) => ({
  error,
  status: promiseStatuses.rejected
});

const createPending = () => ({
  status: promiseStatuses.pending
});

const createFulfilled = <TResult>(result: TResult) => ({
  result,
  status: promiseStatuses.fulfilled
});

const createIdle = () => ({
  status: promiseStatuses.idle
});

export {createIdle, createFulfilled, createPending, createRejected};

export type {
  FulfilledUsePromiseState,
  IdleUsePromiseState,
  PendingUsePromiseState,
  RejectedUsePromiseState,
  UsePromiseState
};
