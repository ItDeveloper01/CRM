// import * as signalR from "@microsoft/signalr";

// class SignalRService {
//   constructor() {
//     this.connection = null;
//   }

//   buildConnection(token, url) {
//     if (this.connection) return;

//     this.connection = new signalR.HubConnectionBuilder()
//       .withUrl(url, {
//         accessTokenFactory: () => token,
//       })
//       .withAutomaticReconnect()
//       .configureLogging(signalR.LogLevel.Information)
//       .build();

//     // ✅ REGISTER HANDLERS IMMEDIATELY AFTER BUILD
//     // This guarantees they exist BEFORE start()

//     this.connection.on("LeadAssigned", () => {});
//     this.connection.on("transferredleaddto", () => {});
//     this.connection.on("ReceiveNotification", () => {});

//     this.connection.onclose((err) => {
//       console.warn("❌ Notification Connection closed:", err);
//     });
//   }

//   async start() {
//     if (!this.connection) return;

//     if (
//       this.connection.state === signalR.HubConnectionState.Disconnected
//     ) {
//       try {
//         await this.connection.start();
//         console.log("✅ Connected to NotificationHub");
//       } catch (err) {
//         console.error("🚫 SignalR connection failed:", err);
//       }
//     }
//   }

//   on(eventName, callback) {
//     this.connection?.on(eventName, callback);
//   }

//   off(eventName, callback) {
//     this.connection?.off(eventName, callback);
//   }
// }

// export default new SignalRService();

// import * as signalR from "@microsoft/signalr";
// import config from "./config";

// class SignalRService {
//   constructor() {
//     this.connection = null;
//   }

//   startConnection(token) {
//     if (this.connection) return this.connection;

//     this.connection = new signalR.HubConnectionBuilder()
//       .withUrl(config.notificationUrl, {
//         accessTokenFactory: () => token,
//       })
//       .withAutomaticReconnect()
//       .configureLogging(signalR.LogLevel.Information)
//       .build();

//     this.connection
//       .start()
//       .then(() => console.log("✅ SignalR Connected"))
//       .catch((err) => console.error("🚫 SignalR Connection Failed:", err));

//     this.connection.onclose(() => {
//       console.warn("❌ SignalR Connection closed");
//     });

//     return this.connection;
//   }

//   getConnection() {
//     return this.connection;
//   }

//   // ✅ ADD THIS
//   on(eventName, callback) {
//     this.connection?.on(eventName, callback);
//   }

//   // ✅ ADD THIS
//   off(eventName, callback) {
//     this.connection?.off(eventName, callback);
//   }
// }

// export default new SignalRService();


import * as signalR from "@microsoft/signalr";
import config from "./config";

class SignalRService {

  static connection = null;
  static isStarting = false;
  static handlersQueue = [];

  static async startConnection(token) {

    if (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    ) {
      console.log("♻️ Reusing SignalR connection");
      return this.connection;
    }

    if (this.isStarting) {
      console.log("⏳ SignalR already starting...");
      return this.connection;
    }

    console.log("🚀 Creating SignalR connection...");
    this.isStarting = true;

    try {

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(config.notificationUrl, {
          accessTokenFactory: () => token,
          transport:
            signalR.HttpTransportType.WebSockets |
            signalR.HttpTransportType.LongPolling,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000])
        .configureLogging(signalR.LogLevel.Information)
        .build();



      this.connection.onclose(() => console.warn("⚠️ SignalR connection closed") );
      this.connection.onreconnecting(() => console.log("🔄 SignalR reconnecting...") );
      this.connection.onreconnected(() => console.log("✅ SignalR reconnected"));

      console.log("⏳ Starting SignalR...");
          await this.connection.start();

        console.log("✅ SignalR Connected");

      // 🌐 Register queued handlers
      this.handlersQueue.forEach(({ event, handler }) => {
        debugger;
        this.connection.on(event, handler);
        console.log(`🎯 Handler activated for "${event}"`);
      });

      this.handlersQueue = [];

    } catch (err) {

      console.error("🔥 SignalR start failed:", err);
      this.connection = null;

    } finally {

      this.isStarting = false;

    }

    return this.connection;
  }

  // 🌐 Safe event registration
  static safeOn(eventName, handler) {
 debugger;

    console.log("**********************************************************");
    console.log(`🔍 Attempting to register handler for "${eventName}"`);
    console.log("Current connection state:", this.connection ? this.connection.state : "No connection");
    console.log("Is starting:", this.isStarting);
    console.log("Handlers queue length:", this.handlersQueue.length);
    console.log("Existing handlers for event:", this.connection ? this.connection._callbacks[eventName] : "No connection");
    console.log("**********************************************************");
    if (!this.connection) {

      console.log(`⏳ Queuing handler for "${eventName}"`);
  
      this.handlersQueue = this.handlersQueue.filter(
      h => !(h.event === eventName && h.handler === handler)
    );
      this.handlersQueue.push({
        event: eventName,
        handler: handler,
      });

      return;
    }

    this.connection.off(eventName,handler); // prevent duplicates
    this.connection.on(eventName, handler);

    console.log(`🎯 Handler registered for "${eventName}"`);
  }

  static safeOff(eventName, handler) {
    debugger;
    console.log("++==++==++==++==++==++==++==++==++==++==++==++==++==++==++==++");
    console.log(`🔍 Attempting to remove handler for "${eventName}"`);
    console.log("Current connection state:", this.connection ? this.connection.state : "No connection");
    console.log("Handlers queue length:", this.handlersQueue.length);
    console.log("++==++==++==++==++==++==++==++==++==++==++==++==++==++==++==++");
    if (!this.connection) return;

    this.connection.off(eventName, handler);

    console.log(`🧹 Handler removed for "${eventName}"`);
  }

}

export default SignalRService;
// import * as signalR from "@microsoft/signalr";
// import config from "./config";

// class SignalRService {
//   static connection = null;
//   static isStarting = false;

//   static async startConnection(token) {

//     // ♻️ Reuse connection if already connected
//     if (
//       this.connection &&
//       this.connection.state === signalR.HubConnectionState.Connected
//     ) {
//       console.log("♻️ Reusing existing SignalR connection");
//       return this.connection;
//     }

//     // ⏳ If another component already starting it
//     if (this.isStarting) {
//       console.log("⏳ SignalR already starting, waiting...");
//       while (this.isStarting) {
//         await new Promise((r) => setTimeout(r, 100));
//       }
//       return this.connection;
//     }

//     console.log("🚀 Creating SignalR connection...");
//     this.isStarting = true;

//     try {

//       this.connection = new signalR.HubConnectionBuilder()
//         .withUrl(config.notificationUrl, {
//           accessTokenFactory: () => token,

//           // 🌐 Helps avoid negotiation issues
//           transport:
//             signalR.HttpTransportType.WebSockets |
//             signalR.HttpTransportType.LongPolling,
//         })

//         .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])

//         .configureLogging(signalR.LogLevel.Information)

//         .build();

//       // lifecycle logs
//       this.connection.onclose((err) => {
//         console.warn("⚠️ SignalR connection closed", err);
//       });

//       this.connection.onreconnecting(() => {
//         console.log("🔄 SignalR reconnecting...");
//       });

//       this.connection.onreconnected(() => {
//         console.log("✅ SignalR reconnected");
//       });

//       console.log("⏳ Starting SignalR...");
//       await this.connection.start();

//       console.log("✅ SignalR Connected");

//     } catch (err) {
//       console.error("🔥 SignalR start failed:", err);
//       this.connection = null;
//     } finally {
//       this.isStarting = false;
//     }

//     return this.connection;
//   }

//   // Register event safely
//   static safeOn(eventName, handler) {
//     if (!this.connection) {
//       console.warn(`⚠️ Cannot register "${eventName}", connection not ready`);
//       return;
//     }

//     // remove duplicate handlers first
//     this.connection.off(eventName, handler);

//     this.connection.on(eventName, handler);

//     debugger;

//     console.log(`🎯 Handler registered for "${eventName}"`);
//   }

//   // Unregister event safely
//   static safeOff(eventName, handler) {
//     if (!this.connection) return;

//     this.connection.off(eventName, handler);

//     console.log(`🧹 Handler removed for "${eventName}"`);
//   }

//   static async stopConnection() {
//     if (!this.connection) return;

//     try {
//       await this.connection.stop();
//       console.log("🧹 SignalR stopped");
//     } catch (err) {
//       console.error("SignalR stop error:", err);
//     }

//     this.connection = null;
//   }
// }

// export default SignalRService;
// class SignalRService {


//   static connection = null;
//   static isStarting = false;

//   static async startConnection(token) {
//     // ♻️ Reuse existing connection if already started
//     if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
//       console.log("♻️ Reusing existing SignalR connection");
//       return this.connection;
//     }

//     if (this.isStarting) {
//       console.log("⏳ SignalR connection is already starting, waiting...");
//       // wait until connection is ready
//       while (this.isStarting) {
//         await new Promise((res) => setTimeout(res, 100));
//       }
//       return this.connection;
//     }

//     console.log("🚀 Creating new SignalR connection...");
//     this.isStarting = true;

//     this.connection = new signalR.HubConnectionBuilder()
//       .withUrl(config.notificationUrl, {
//         accessTokenFactory: () => token,
//       })
//       .withAutomaticReconnect()
//       .configureLogging(signalR.LogLevel.Information)
//       .build();

//     // optional: handle connection closed
//     this.connection.onclose((err) => {
//       console.warn("⚠️ SignalR connection closed", err);
//     });

//     try {
//       console.log("⏳ Starting SignalR connection...");
//       await this.connection.start();
//       console.log("✅ SignalR connected");
//     } catch (err) {
//       console.error("🔥 SignalR connection error:", err);
//       this.connection = null; // reset so retry works
//     } finally {
//       this.isStarting = false;
//     }

//     return this.connection;
//   }

//   static safeOn(eventName, handler) {
//     if (!this.connection) {
//       console.warn(`⚠️ Cannot register handler "${eventName}", connection not ready`);
//       return;
//     }
//     this.connection.on(eventName, handler);
//     console.log(`🎯 Registered handler for "${eventName}"`);
//   }

//   static safeOff(eventName, handler) {
//     if (!this.connection) return;
//     this.connection.off(eventName, handler);
//     console.log(`🧹 Unregistered handler for "${eventName}"`);
//   }
// }

// export default SignalRService;
