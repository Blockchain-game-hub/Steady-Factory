/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface AlchemistInterface extends ethers.utils.Interface {
  functions: {
    "Chyme()": FunctionFragment;
    "elixir()": FunctionFragment;
    "elixirAddr()": FunctionFragment;
    "getElixirAddr()": FunctionFragment;
    "getSteadyAddr()": FunctionFragment;
    "initialize(address,address,address,address)": FunctionFragment;
    "merge(uint256)": FunctionFragment;
    "priceFromOracle()": FunctionFragment;
    "priceOracle()": FunctionFragment;
    "sdtAddress()": FunctionFragment;
    "split(uint256)": FunctionFragment;
    "steady()": FunctionFragment;
    "steadyAddr()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "Chyme", values?: undefined): string;
  encodeFunctionData(functionFragment: "elixir", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "elixirAddr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getElixirAddr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getSteadyAddr",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string]
  ): string;
  encodeFunctionData(functionFragment: "merge", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "priceFromOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "priceOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "sdtAddress",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "split", values: [BigNumberish]): string;
  encodeFunctionData(functionFragment: "steady", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "steadyAddr",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "Chyme", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "elixir", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "elixirAddr", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getElixirAddr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getSteadyAddr",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "merge", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "priceFromOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "priceOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "sdtAddress", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "split", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "steady", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "steadyAddr", data: BytesLike): Result;

  events: {
    "Merge(address,uint256,int256)": EventFragment;
    "Split(address,uint256,int256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Merge"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Split"): EventFragment;
}

export type MergeEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    source: string;
    mergedAmount: BigNumber;
    price: BigNumber;
  }
>;

export type SplitEvent = TypedEvent<
  [string, BigNumber, BigNumber] & {
    source: string;
    splitAmount: BigNumber;
    price: BigNumber;
  }
>;

export class Alchemist extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: AlchemistInterface;

  functions: {
    Chyme(overrides?: CallOverrides): Promise<[string]>;

    elixir(overrides?: CallOverrides): Promise<[string]>;

    elixirAddr(overrides?: CallOverrides): Promise<[string]>;

    getElixirAddr(overrides?: CallOverrides): Promise<[string]>;

    getSteadyAddr(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _Chyme: string,
      _Steady: string,
      _Elixir: string,
      _priceOracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    merge(
      ChymeAmountToMerge: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    priceFromOracle(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { price: BigNumber }>;

    priceOracle(overrides?: CallOverrides): Promise<[string]>;

    sdtAddress(overrides?: CallOverrides): Promise<[string]>;

    split(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    steady(overrides?: CallOverrides): Promise<[string]>;

    steadyAddr(overrides?: CallOverrides): Promise<[string]>;
  };

  Chyme(overrides?: CallOverrides): Promise<string>;

  elixir(overrides?: CallOverrides): Promise<string>;

  elixirAddr(overrides?: CallOverrides): Promise<string>;

  getElixirAddr(overrides?: CallOverrides): Promise<string>;

  getSteadyAddr(overrides?: CallOverrides): Promise<string>;

  initialize(
    _Chyme: string,
    _Steady: string,
    _Elixir: string,
    _priceOracle: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  merge(
    ChymeAmountToMerge: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  priceFromOracle(overrides?: CallOverrides): Promise<BigNumber>;

  priceOracle(overrides?: CallOverrides): Promise<string>;

  sdtAddress(overrides?: CallOverrides): Promise<string>;

  split(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  steady(overrides?: CallOverrides): Promise<string>;

  steadyAddr(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    Chyme(overrides?: CallOverrides): Promise<string>;

    elixir(overrides?: CallOverrides): Promise<string>;

    elixirAddr(overrides?: CallOverrides): Promise<string>;

    getElixirAddr(overrides?: CallOverrides): Promise<string>;

    getSteadyAddr(overrides?: CallOverrides): Promise<string>;

    initialize(
      _Chyme: string,
      _Steady: string,
      _Elixir: string,
      _priceOracle: string,
      overrides?: CallOverrides
    ): Promise<void>;

    merge(
      ChymeAmountToMerge: BigNumberish,
      overrides?: CallOverrides
    ): Promise<boolean>;

    priceFromOracle(overrides?: CallOverrides): Promise<BigNumber>;

    priceOracle(overrides?: CallOverrides): Promise<string>;

    sdtAddress(overrides?: CallOverrides): Promise<string>;

    split(amount: BigNumberish, overrides?: CallOverrides): Promise<boolean>;

    steady(overrides?: CallOverrides): Promise<string>;

    steadyAddr(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "Merge(address,uint256,int256)"(
      source?: string | null,
      mergedAmount?: null,
      price?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { source: string; mergedAmount: BigNumber; price: BigNumber }
    >;

    Merge(
      source?: string | null,
      mergedAmount?: null,
      price?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { source: string; mergedAmount: BigNumber; price: BigNumber }
    >;

    "Split(address,uint256,int256)"(
      source?: string | null,
      splitAmount?: null,
      price?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { source: string; splitAmount: BigNumber; price: BigNumber }
    >;

    Split(
      source?: string | null,
      splitAmount?: null,
      price?: null
    ): TypedEventFilter<
      [string, BigNumber, BigNumber],
      { source: string; splitAmount: BigNumber; price: BigNumber }
    >;
  };

  estimateGas: {
    Chyme(overrides?: CallOverrides): Promise<BigNumber>;

    elixir(overrides?: CallOverrides): Promise<BigNumber>;

    elixirAddr(overrides?: CallOverrides): Promise<BigNumber>;

    getElixirAddr(overrides?: CallOverrides): Promise<BigNumber>;

    getSteadyAddr(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _Chyme: string,
      _Steady: string,
      _Elixir: string,
      _priceOracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    merge(
      ChymeAmountToMerge: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    priceFromOracle(overrides?: CallOverrides): Promise<BigNumber>;

    priceOracle(overrides?: CallOverrides): Promise<BigNumber>;

    sdtAddress(overrides?: CallOverrides): Promise<BigNumber>;

    split(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    steady(overrides?: CallOverrides): Promise<BigNumber>;

    steadyAddr(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    Chyme(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    elixir(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    elixirAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getElixirAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getSteadyAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _Chyme: string,
      _Steady: string,
      _Elixir: string,
      _priceOracle: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    merge(
      ChymeAmountToMerge: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    priceFromOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    priceOracle(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    sdtAddress(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    split(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    steady(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    steadyAddr(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
