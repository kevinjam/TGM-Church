// Register every model by importing its module (side effect), then
// re-export each model + document type for convenient imports, e.g.:
//
//   import { connectToDatabase, EventModel } from "@/lib/db";
//
// Importing from "@/lib/db" is safe on the server only — none of these
// modules may be pulled into client bundles.

import "./contact-message";
import "./event";
import "./leader";
import "./media";
import "./ministry";
import "./page";
import "./sermon";
import "./site-settings";
import "./user";

export * from "./contact-message";
export * from "./event";
export * from "./leader";
export * from "./media";
export * from "./ministry";
export * from "./page";
export * from "./sermon";
export * from "./site-settings";
export * from "./user";
