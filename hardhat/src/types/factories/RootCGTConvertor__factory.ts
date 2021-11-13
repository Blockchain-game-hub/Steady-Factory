/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RootCGTConvertor,
  RootCGTConvertorInterface,
} from "../RootCGTConvertor";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_CGT",
        type: "address",
      },
      {
        internalType: "address",
        name: "_Steady",
        type: "address",
      },
      {
        internalType: "address",
        name: "_Unsteady",
        type: "address",
      },
      {
        internalType: "address",
        name: "_priceOracle",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mergedAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "price",
        type: "int256",
      },
    ],
    name: "Merge",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "src",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "splitAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "price",
        type: "int256",
      },
    ],
    name: "Split",
    type: "event",
  },
  {
    inputs: [],
    name: "CGT",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "cgtAmountToMerge",
        type: "uint256",
      },
    ],
    name: "mergeCGT",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "priceFromOracle",
    outputs: [
      {
        internalType: "int256",
        name: "price",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "priceOracle",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "splitCGT",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "steady",
    outputs: [
      {
        internalType: "contract Steady",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "unsteady",
    outputs: [
      {
        internalType: "contract Unsteady",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260086004553480156200001657600080fd5b5060405162001b5938038062001b5983398181016040528101906200003c919062000160565b836000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505062000225565b6000815190506200015a816200020b565b92915050565b600080600080608085870312156200017d576200017c62000206565b5b60006200018d8782880162000149565b9450506020620001a08782880162000149565b9350506040620001b38782880162000149565b9250506060620001c68782880162000149565b91505092959194509250565b6000620001df82620001e6565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600080fd5b6200021681620001d2565b81146200022257600080fd5b50565b61192480620002356000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80636cfa05381161005b5780636cfa0538146101175780636d6f6076146101355780637a95f174146101655780637eacc25f1461018357610088565b806311a07f911461008d5780632563d0d0146100ab5780632630c12f146100db578063313ce567146100f9575b600080fd5b6100956101a1565b6040516100a291906113b8565b60405180910390f35b6100c560048036038101906100c091906110bb565b6102d1565b6040516100d2919061134c565b60405180910390f35b6100e361087f565b6040516100f091906112d1565b60405180910390f35b6101016108a5565b60405161010e91906114b5565b60405180910390f35b61011f6108ab565b60405161012c919061139d565b60405180910390f35b61014f600480360381019061014a91906110bb565b6108d1565b60405161015c919061134c565b60405180910390f35b61016d610c14565b60405161017a9190611367565b60405180910390f35b61018b610c38565b6040516101989190611382565b60405180910390f35b6000806040516024016040516020818303038152906040527f8e15f473000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505090506000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168260405161027291906112ba565b600060405180830381855afa9150503d80600081146102ad576040519150601f19603f3d011682016040523d82523d6000602084013e6102b2565b606091505b50915050808060200190518101906102ca919061108e565b9250505090565b60006102db610ff3565b6102e3610ff3565b60006102f760016102f26101a1565b610c5e565b90506402540be40081604b8761030d919061155c565b610317919061155c565b610321919061152b565b8260200181815250506064601986610339919061155c565b610343919061152b565b836020018181525050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b81526004016103a791906112d1565b60206040518083038186803b1580156103bf57600080fd5b505afa1580156103d3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103f791906110e8565b836000018181525050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b815260040161045b91906112d1565b60206040518083038186803b15801561047357600080fd5b505afa158015610487573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104ab91906110e8565b8260000181815250508260000151836020015111156104ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104f690611475565b60405180910390fd5b81600001518260200151111561054a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610541906113f5565b60405180910390fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166379cc67903385602001516040518363ffffffff1660e01b81526004016105ab929190611323565b600060405180830381600087803b1580156105c557600080fd5b505af11580156105d9573d6000803e3d6000fd5b50505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166379cc67903384602001516040518363ffffffff1660e01b815260040161063e929190611323565b600060405180830381600087803b15801561065857600080fd5b505af115801561066c573d6000803e3d6000fd5b50505050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b81526004016106cb91906112d1565b60206040518083038186803b1580156106e357600080fd5b505afa1580156106f7573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061071b91906110e8565b836000018181525050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b815260040161077f91906112d1565b60206040518083038186803b15801561079757600080fd5b505afa1580156107ab573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107cf91906110e8565b8260000181815250503373ffffffffffffffffffffffffffffffffffffffff167fe16ce85ab68c6b954fe4487ea4075f9afd57602a905875f367a50eef4c7d5b8786836040516108209291906114d0565b60405180910390a2610873338660008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16610c779092919063ffffffff16565b60019350505050919050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600a8210156108e157600080fd5b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231336040518263ffffffff1660e01b815260040161093d91906112d1565b60206040518083038186803b15801561095557600080fd5b505afa158015610969573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061098d91906110e8565b9050808311156109d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c990611435565b60405180910390fd5b60006109e660016109e16101a1565b610c5e565b905060006402540be40082604b876109fe919061155c565b610a08919061155c565b610a12919061152b565b9050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166340c10f1933836040518363ffffffff1660e01b8152600401610a71929190611323565b600060405180830381600087803b158015610a8b57600080fd5b505af1158015610a9f573d6000803e3d6000fd5b50505050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166340c10f19336064601989610af1919061155c565b610afb919061152b565b6040518363ffffffff1660e01b8152600401610b18929190611323565b602060405180830381600087803b158015610b3257600080fd5b505af1158015610b46573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b6a9190611061565b503373ffffffffffffffffffffffffffffffffffffffff167f563287642471a421e73cd8c32313a493560c2f122e409c0099b4449f7297cce68684604051610bb39291906114d0565b60405180910390a2610c0833308760008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16610cfd909392919063ffffffff16565b60019350505050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000818313610c6d5781610c6f565b825b905092915050565b610cf88363a9059cbb60e01b8484604051602401610c96929190611323565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610d86565b505050565b610d80846323b872dd60e01b858585604051602401610d1e939291906112ec565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff8381831617835250505050610d86565b50505050565b6000610de8826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65648152508573ffffffffffffffffffffffffffffffffffffffff16610e4d9092919063ffffffff16565b9050600081511115610e485780806020019051810190610e089190611061565b610e47576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e3e90611495565b60405180910390fd5b5b505050565b6060610e5c8484600085610e65565b90509392505050565b606082471015610eaa576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ea190611415565b60405180910390fd5b610eb385610f79565b610ef2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ee990611455565b60405180910390fd5b6000808673ffffffffffffffffffffffffffffffffffffffff168587604051610f1b91906112ba565b60006040518083038185875af1925050503d8060008114610f58576040519150601f19603f3d011682016040523d82523d6000602084013e610f5d565b606091505b5091509150610f6d828286610f8c565b92505050949350505050565b600080823b905060008111915050919050565b60608315610f9c57829050610fec565b600083511115610faf5782518084602001fd5b816040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fe391906113d3565b60405180910390fd5b9392505050565b604051806040016040528060008152602001600081525090565b60008151905061101c816118a9565b92915050565b600081519050611031816118c0565b92915050565b600081359050611046816118d7565b92915050565b60008151905061105b816118d7565b92915050565b60006020828403121561107757611076611705565b5b60006110858482850161100d565b91505092915050565b6000602082840312156110a4576110a3611705565b5b60006110b284828501611022565b91505092915050565b6000602082840312156110d1576110d0611705565b5b60006110df84828501611037565b91505092915050565b6000602082840312156110fe576110fd611705565b5b600061110c8482850161104c565b91505092915050565b61111e816115b6565b82525050565b61112d816115c8565b82525050565b600061113e826114f9565b611148818561150f565b9350611158818560208601611674565b80840191505092915050565b61116d81611608565b82525050565b61117c8161162c565b82525050565b61118b81611650565b82525050565b61119a816115d4565b82525050565b60006111ab82611504565b6111b5818561151a565b93506111c5818560208601611674565b6111ce8161170a565b840191505092915050565b60006111e660228361151a565b91506111f18261171b565b604082019050919050565b600061120960268361151a565b91506112148261176a565b604082019050919050565b600061122c601b8361151a565b9150611237826117b9565b602082019050919050565b600061124f601d8361151a565b915061125a826117e2565b602082019050919050565b600061127260248361151a565b915061127d8261180b565b604082019050919050565b6000611295602a8361151a565b91506112a08261185a565b604082019050919050565b6112b4816115fe565b82525050565b60006112c68284611133565b915081905092915050565b60006020820190506112e66000830184611115565b92915050565b60006060820190506113016000830186611115565b61130e6020830185611115565b61131b60408301846112ab565b949350505050565b60006040820190506113386000830185611115565b61134560208301846112ab565b9392505050565b60006020820190506113616000830184611124565b92915050565b600060208201905061137c6000830184611164565b92915050565b60006020820190506113976000830184611173565b92915050565b60006020820190506113b26000830184611182565b92915050565b60006020820190506113cd6000830184611191565b92915050565b600060208201905081810360008301526113ed81846111a0565b905092915050565b6000602082019050818103600083015261140e816111d9565b9050919050565b6000602082019050818103600083015261142e816111fc565b9050919050565b6000602082019050818103600083015261144e8161121f565b9050919050565b6000602082019050818103600083015261146e81611242565b9050919050565b6000602082019050818103600083015261148e81611265565b9050919050565b600060208201905081810360008301526114ae81611288565b9050919050565b60006020820190506114ca60008301846112ab565b92915050565b60006040820190506114e560008301856112ab565b6114f26020830184611191565b9392505050565b600081519050919050565b600081519050919050565b600081905092915050565b600082825260208201905092915050565b6000611536826115fe565b9150611541836115fe565b925082611551576115506116d6565b5b828204905092915050565b6000611567826115fe565b9150611572836115fe565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156115ab576115aa6116a7565b5b828202905092915050565b60006115c1826115de565b9050919050565b60008115159050919050565b6000819050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b60006116138261161a565b9050919050565b6000611625826115de565b9050919050565b60006116378261163e565b9050919050565b6000611649826115de565b9050919050565b600061165b82611662565b9050919050565b600061166d826115de565b9050919050565b60005b83811015611692578082015181840152602081019050611677565b838111156116a1576000848401525b50505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600080fd5b6000601f19601f8301169050919050565b7f596f7520646f206e6f7420686176652073756666696369656e7420537465616460008201527f792e000000000000000000000000000000000000000000000000000000000000602082015250565b7f416464726573733a20696e73756666696369656e742062616c616e636520666f60008201527f722063616c6c0000000000000000000000000000000000000000000000000000602082015250565b7f596f7520646f206e6f74206861766520656e6f756768204347542e0000000000600082015250565b7f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000600082015250565b7f596f7520646f206e6f7420686176652073756666696369656e7420556e73746560008201527f6164792e00000000000000000000000000000000000000000000000000000000602082015250565b7f5361666545524332303a204552433230206f7065726174696f6e20646964206e60008201527f6f74207375636365656400000000000000000000000000000000000000000000602082015250565b6118b2816115c8565b81146118bd57600080fd5b50565b6118c9816115d4565b81146118d457600080fd5b50565b6118e0816115fe565b81146118eb57600080fd5b5056fea2646970667358221220046b2fc422d72389f4a3394158c660c691f3190a46096ad3f63db2be38643eb964736f6c63430008060033";

export class RootCGTConvertor__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _CGT: string,
    _Steady: string,
    _Unsteady: string,
    _priceOracle: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RootCGTConvertor> {
    return super.deploy(
      _CGT,
      _Steady,
      _Unsteady,
      _priceOracle,
      overrides || {}
    ) as Promise<RootCGTConvertor>;
  }
  getDeployTransaction(
    _CGT: string,
    _Steady: string,
    _Unsteady: string,
    _priceOracle: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _CGT,
      _Steady,
      _Unsteady,
      _priceOracle,
      overrides || {}
    );
  }
  attach(address: string): RootCGTConvertor {
    return super.attach(address) as RootCGTConvertor;
  }
  connect(signer: Signer): RootCGTConvertor__factory {
    return super.connect(signer) as RootCGTConvertor__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RootCGTConvertorInterface {
    return new utils.Interface(_abi) as RootCGTConvertorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RootCGTConvertor {
    return new Contract(address, _abi, signerOrProvider) as RootCGTConvertor;
  }
}
