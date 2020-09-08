import PromiseCanceledError from "@mgtitimoli/utils-promise/dist/PromiseCanceledError";
import * as withCancelablePromise from "@mgtitimoli/utils-promise/dist/cancelablePromise";
import {useEffect, useState} from "react";

import type {ReactSetStateFrom} from "@mgtitimoli/react-state";

import * as withUsePromiseState from "./usePromiseState";
import {usePromiseStatuses} from "./usePromiseStatus";

import type {UsePromiseState} from "./usePromiseState";

type PromiseOrSkipped<TResult> = false | Promise<TResult>;

type CreatePromise<TResult> = () => PromiseOrSkipped<TResult>;

type SetUsePromiseState<TResult> = ReactSetStateFrom<UsePromiseState<TResult>>;

const onPromiseRejected = <TResult>(
  setUsePromiseState: SetUsePromiseState<TResult>
) => (error: Error) => {
  if (!(error instanceof PromiseCanceledError)) {
    setUsePromiseState(withUsePromiseState.createRejected(error));
  }
};

const onPromiseFulfilled = <TResult>(
  setUsePromiseState: SetUsePromiseState<TResult>
) => (result: TResult) =>
  setUsePromiseState(withUsePromiseState.createFulfilled(result));

const handleSkipped = <TResult>(
  setUsePromiseState: SetUsePromiseState<TResult>
) => {
  setUsePromiseState(withUsePromiseState.createSkipped());
};

const handlePromise = <TResult>(
  setUsePromiseState: SetUsePromiseState<TResult>,
  promise: Promise<TResult>
) => {
  setUsePromiseState(withUsePromiseState.createPending);

  const cancellablePromise = withCancelablePromise.create(promise);

  cancellablePromise.promise
    .then(onPromiseFulfilled(setUsePromiseState))
    .catch(onPromiseRejected(setUsePromiseState));

  return cancellablePromise.cancel;
};

const handlePromiseOrSkipped = <TResult>(
  setUsePromiseState: SetUsePromiseState<TResult>,
  promiseOrSkipped: PromiseOrSkipped<TResult>
) =>
  promiseOrSkipped === false
    ? handleSkipped(setUsePromiseState)
    : handlePromise(setUsePromiseState, promiseOrSkipped);

const initialUsePromiseState = withUsePromiseState.createIdle();

const usePromise = <TResult>(
  createPromise: CreatePromise<TResult>,
  dependencies: Array<unknown> = []
) => {
  const [usePromiseState, setUsePromiseState] = useState<
    UsePromiseState<TResult>
  >(initialUsePromiseState);

  useEffect(
    () => handlePromiseOrSkipped(setUsePromiseState, createPromise()),
    dependencies
  );

  return usePromiseState;
};

usePromise.statuses = usePromiseStatuses;

export default usePromise;
