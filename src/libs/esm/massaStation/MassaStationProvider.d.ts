import { IAccountDetails } from "../account";
import { IAccount } from "../account/IAccount";
import { IAccountDeletionResponse } from "../provider/AccountDeletion";
import { IAccountImportResponse } from "../provider/AccountImport";
import { IProvider } from "../provider/IProvider";
import { PluginInfo } from "./types";

/**
 * MassaStation url
 */
export declare const MASSA_STATION_URL = "https://station.massa/";
/**
 * The MassaStation accounts url
 */
export declare const MASSA_STATION_ACCOUNTS_URL: string;
/**
 * MassaStation's url for importing accounts
 */
export declare const MASSA_STATION_IMPORT_ACCOUNTS_URL: string;
/**
 * MassaStation's wallet provider name
 */
export declare const MASSA_STATION_PROVIDER_NAME = "MASSASTATION";
/**
 * This interface represents the payload returned by making a call to MassaStation's accounts url.
 */
export interface IMassaStationWallet {
  address: string;
  nickname: string;
  keyPair: {
    nonce: string;
    privateKey: string;
    publicKey: string;
    salt: string;
  };
  status: MassaStationAccountStatus;
}
declare enum MassaStationAccountStatus {
  OK = "ok",
  CORRUPTED = "corrupted",
}
/**
 * This class provides an implementation for communicating with the MassaStation wallet provider.
 * @remarks
 * This class is used as a proxy to the MassaStation server for exchanging message over https calls.
 */
export declare class MassaStationProvider implements IProvider {
  private infos;
  private providerName;
  private massaStationEventsListener;
  private currentNetwork;
  /**
   * Provider constructor
   *
   * @param providerName - The name of the provider.
   * @returns An instance of the Provider class.
   */
  constructor(infos: PluginInfo);
  /**
   * This method returns the name of the provider.
   * @returns The name of the provider.
   */
  name(): string;
  /**
   * This method sends a message to the MassaStation server to get the list of accounts for the provider.
   * It returns a Promise that resolves to an array of Account instances.
   *
   * @returns A promise that resolves to an array of Account instances.
   */
  accounts(): Promise<IAccount[]>;
  /**
   * This method makes an http call to the MassaStation server to import an account with
   * the given publicKey and privateKey.
   *
   * @param publicKey - The public key of the account.
   * @param privateKey - The private key of the account.
   *
   * @returns a Promise that resolves to an instance of IAccountImportResponse.
   */
  importAccount(
    publicKey: string,
    privateKey: string
  ): Promise<IAccountImportResponse>;
  /**
   * This method sends an http call to the MassaStation server to delete the account associated with the given address.
   *
   * @param address - The address of the account.
   * @returns a Promise that resolves to an instance of IAccountDeletionResponse.
   */
  deleteAccount(address: string): Promise<IAccountDeletionResponse>;
  /**
   * This method sends an http call to the MassaStation server to obtain node urls.
   *
   * @throws an error if the call fails.
   *
   * @returns a Promise that resolves to a list of node urls.
   */
  getNodesUrls(): Promise<string[]>;
  /**
   * Returns the name of the network MassaStation is connected to.
   *
   * @throws an error if the call fails.
   *
   * @returns a Promise that resolves to a network.
   */
  getNetwork(): Promise<string>;
  /**
   * This method sends an http call to the MassaStation server to create a new random account.
   *
   * @returns a Promise that resolves to the details of the newly generated account.
   */
  generateNewAccount(name: string): Promise<IAccountDetails>;
  listenAccountChanges(callback: (address: string) => void):
    | {
        unsubscribe: () => void;
      }
    | undefined;
  listenNetworkChanges(callback: (network: string) => void):
    | {
        unsubscribe: () => void;
      }
    | undefined;
  connect(): Promise<boolean>;
  disconnect(): Promise<boolean>;
  connected(): boolean;
  enabled(): boolean;
}
export {};
//# sourceMappingURL=MassaStationProvider.d.ts.map