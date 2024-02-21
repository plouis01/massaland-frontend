import {
  AvailableCommands,
  IAccountBalanceRequest,
  IAccountBalanceResponse,
  IAccountDeletionRequest,
  IAccountDeletionResponse,
  IAccountImportRequest,
  IAccountImportResponse,
  IAccountSignRequest,
  IAccountSignResponse,
} from "..";
import { IAccount } from "../account/IAccount";
import { PluginInfo } from "../massaStation/types";

/**
 * A constant string that is used to identify the HTML element that is used for
 * communication between the web page script and the content script.
 */
export declare const MASSA_WINDOW_OBJECT = "massaWalletProvider";
type CallbackFunction = (
  result: AllowedResponses,
  error: Error | null
) => unknown;
export type AllowedRequests =
  | object
  | IAccountBalanceRequest
  | IAccountSignRequest
  | IAccountImportRequest
  | IAccountDeletionRequest;
export type AllowedResponses =
  | object
  | IAccountBalanceResponse
  | IAccountSignResponse
  | IAccountImportResponse
  | IAccountDeletionResponse
  | IAccount[]
  | string;
/**
 * This class enables communication with the content script by sending and receiving messages.
 * @remarks
 * - This class is used to send messages to the content script and to receive messages from the content script.
 * - It is used to send messages to the content script and to receive messages from the content script.
 *
 */
declare class Connector {
  private registeredProviders;
  private pendingRequests;
  private massaStationListener;
  private providersInfo;
  /**
   * Connector constructor
   *
   * @remarks
   * - The Connector constructor takes no arguments.
   * - It creates a Map object that is used to store pending requests.
   * - It creates an HTML element that is used to communicate with the content script.
   * - It adds an event listener to the HTML element that is used to communicate with the content script.
   *
   * @returns An instance of the Connector class.
   *
   */
  constructor();
  /**
   * This method adds a register listener in the web page.
   * It listens to the 'register' event.
   *
   * @returns void
   *
   * @remarks
   * - It is used to register a new provider.
   * - This method creates a new HTML element and a listener that listens to the register event.
   *
   */
  private register;
  private initMassaStationListener;
  startMassaStationDiscovery(): Promise<void>;
  /**
   * This method sends a message from the webpage script to the content script.
   *
   * @remarks
   * Sends a message to the content script using the specified provider name, command, and parameters,
   *
   * @privateRemarks
   * This method registers the response callback with a unique ID.
   *
   * @param providerName - The name of the provider.
   * @param command - The command that is sent to the content script (among the {@link AvailableCommands}).
   * @param params - The parameters that are sent to the content script.
   * @param responseCallback - The callback function that is called when the content script sends a response.
   * @returns void
   *
   */
  sendMessageToContentScript(
    providerName: string,
    command: AvailableCommands,
    params: AllowedRequests,
    responseCallback: CallbackFunction
  ): void;
  /**
   * This method returns the registered providers.
   *
   * @returns The registered provider associated with its unique key.
   *
   */
  getWalletProviders(): Record<string, string>;
  /**
   * This method returns the provider wallet info.
   *
   */
  getProviderInfo(providerName: string): PluginInfo | undefined;
  /**
   * This method handles the response from the content script by
   * calling the response callback with the response and error objects.
   *
   * @param event - The event that is sent from the content script.
   * @returns void
   *
   */
  private handleResponseFromContentScript;
}
export declare const connector: Connector;
export {};
//# sourceMappingURL=Connector.d.ts.map