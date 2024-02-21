/**
 * This file defines a TypeScript module named connector.
 * It is the tool that allows the 'provider' and 'account' objects to communicate with the web page script.
 *
 * @remarks
 * - If you are only looking to use our library, the connector object will not be useful to you.
 * - If you want to work on this repo, you will probably be interested in this object
 *
 */
import { AvailableCommands } from "..";
import {
  ON_MASSA_STATION_DISCOVERED,
  ON_MASSA_STATION_DISCONNECTED,
  MassaStationDiscovery,
} from "../massaStation/MassaStationDiscovery";
import { MASSA_STATION_PROVIDER_NAME } from "../massaStation/MassaStationProvider";
import { uid } from "uid";

/**
 * A constant string that is used to identify the HTML element that is used for
 * communication between the web page script and the content script.
 */
export const MASSA_WINDOW_OBJECT = "massaWalletProvider";
/**
 * This class enables communication with the content script by sending and receiving messages.
 * @remarks
 * - This class is used to send messages to the content script and to receive messages from the content script.
 * - It is used to send messages to the content script and to receive messages from the content script.
 *
 */
class Connector {
  registeredProviders = {};
  pendingRequests;
  massaStationListener;
  providersInfo = {};
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
  constructor() {
    if (typeof document !== "undefined") {
      this.pendingRequests = new Map();
      this.massaStationListener = new MassaStationDiscovery();
      this.initMassaStationListener();
      this.register();
      // start listening to messages from content script
      document
        .getElementById(MASSA_WINDOW_OBJECT)
        .addEventListener(
          "message",
          this.handleResponseFromContentScript.bind(this)
        );
    }
  }
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
  register() {
    // global event target to use for all wallet provider
    // check if document exist
    if (typeof document !== "undefined") {
      if (!document.getElementById(MASSA_WINDOW_OBJECT)) {
        const inv = document.createElement("p");
        inv.id = MASSA_WINDOW_OBJECT;
        inv.setAttribute("style", "display:none");
        document.body.appendChild(inv);
      }
      // add an invisible HTML element and set a listener to it like the following
      // hook up register handler
      document
        .getElementById(MASSA_WINDOW_OBJECT)
        .addEventListener("register", (evt) => {
          const payload = evt.detail;
          const providerEventTargetName = `${MASSA_WINDOW_OBJECT}_${payload.providerName}`;
          this.registeredProviders[payload.providerName] =
            providerEventTargetName;
        });
    }
  }
  initMassaStationListener() {
    this.massaStationListener.on(
      ON_MASSA_STATION_DISCOVERED,
      (walletModule) => {
        this.registeredProviders[
          MASSA_STATION_PROVIDER_NAME
        ] = `${MASSA_WINDOW_OBJECT}_${MASSA_STATION_PROVIDER_NAME}`;
        this.providersInfo[MASSA_STATION_PROVIDER_NAME] = walletModule;
      }
    );
    this.massaStationListener.on(ON_MASSA_STATION_DISCONNECTED, () => {
      delete this.registeredProviders[MASSA_STATION_PROVIDER_NAME];
    });
  }
  async startMassaStationDiscovery() {
    try {
      await this.massaStationListener.startListening();
    } catch (e) {
      console.log("get MassaStation provider error: ", e);
    }
  }
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
  sendMessageToContentScript(providerName, command, params, responseCallback) {
    if (!Object.values(AvailableCommands).includes(command)) {
      throw new Error(`Unknown command ${command}`);
    }
    const requestId = uid();
    const eventMessageRequest = {
      params,
      requestId,
    };
    this.pendingRequests.set(requestId, responseCallback);
    // dispatch an event to the specific provider event target
    const specificProviderEventTarget = document?.getElementById(
      `${this.registeredProviders[providerName]}`
    );
    if (!specificProviderEventTarget) {
      throw new Error(
        `Registered provider with name ${providerName} does not exist`
      );
    }
    const isDispatched = specificProviderEventTarget.dispatchEvent(
      new CustomEvent(command, { detail: eventMessageRequest })
    );
    if (!isDispatched) {
      throw new Error(
        `Could not dispatch a message to ${this.registeredProviders[providerName]}`
      );
    }
  }
  /**
   * This method returns the registered providers.
   *
   * @returns The registered provider associated with its unique key.
   *
   */
  getWalletProviders() {
    return this.registeredProviders;
  }
  /**
   * This method returns the provider wallet info.
   *
   */
  getProviderInfo(providerName) {
    return this.providersInfo[providerName];
  }
  /**
   * This method handles the response from the content script by
   * calling the response callback with the response and error objects.
   *
   * @param event - The event that is sent from the content script.
   * @returns void
   *
   */
  handleResponseFromContentScript(event) {
    const { result, error, requestId } = event.detail;
    const responseCallback = this.pendingRequests.get(requestId);
    if (responseCallback) {
      if (error) {
        responseCallback(null, new Error(error.message));
      } else {
        responseCallback(result, null);
      }
      const deleted = this.pendingRequests.delete(requestId);
      if (!deleted) {
        console.error(`Error deleting a pending request with id ${requestId}`);
      }
    } else {
      console.error(
        `Request Id ${requestId} not found in response callback map`
      );
    }
  }
}
export const connector = new Connector();
//# sourceMappingURL=Connector.js.map