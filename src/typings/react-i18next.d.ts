/* eslint-disable @typescript-eslint/ban-types */
import type { TOptions, TFunctionKeys, TFunctionResult, StringMap } from 'react-i18next';

declare module 'react-i18next' {
  type ReturnObjectsOutput = Array<object | string> | object;
  type ReturnObjectsConfig = { returnObjects: true };

  type NewTFunctionResult = Exclude<TFunctionResult, ReturnObjectsOutput>;

  export interface TFunction {
    // w/ returnObjects: true
    <
      TResult extends ReturnObjectsOutput,
      TKeys extends TFunctionKeys = string,
      TInterpolationMap extends object = StringMap
    >(
      key: TKeys | TKeys[],
      options: string | (ReturnObjectsConfig & TOptions<TInterpolationMap>)
    ): TResult;

    // Two arguments
    <
      TResult extends NonNullable<NewTFunctionResult> = string,
      TKeys extends TFunctionKeys = string,
      TInterpolationMap extends object = StringMap
    >(
      key: TKeys | TKeys[],
      options?: TOptions<TInterpolationMap> | string
    ): TResult;
    <
      TResult extends NewTFunctionResult = string,
      TKeys extends TFunctionKeys = string,
      TInterpolationMap extends object = StringMap
    >(
      key: TKeys | TKeys[],
      options?: TOptions<TInterpolationMap> | string
    ): TResult;

    // Three arguments
    <
      TResult extends NonNullable<NewTFunctionResult> = string,
      TKeys extends TFunctionKeys = string,
      TInterpolationMap extends object = StringMap
    >(
      key: TKeys | TKeys[],
      defaultValue?: string,
      options?: TOptions<TInterpolationMap> | string
    ): TResult;
    <
      TResult extends NewTFunctionResult = string,
      TKeys extends TFunctionKeys = string,
      TInterpolationMap extends object = StringMap
    >(
      key: TKeys | TKeys[],
      defaultValue?: string,
      options?: TOptions<TInterpolationMap> | string
    ): TResult;
  }
}
