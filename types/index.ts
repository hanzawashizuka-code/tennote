export type { Database } from "./database";
export type { ChatMessage, CoachSession } from "./coach";
export type { UserSubscription } from "./stripe";

export type Profile = import("./database").Database["public"]["Tables"]["profiles"]["Row"];
export type Post = import("./database").Database["public"]["Tables"]["posts"]["Row"];
export type Message = import("./database").Database["public"]["Tables"]["messages"]["Row"];
export type Conversation = import("./database").Database["public"]["Tables"]["conversations"]["Row"];
export type Event = import("./database").Database["public"]["Tables"]["events"]["Row"];
export type EventEntry = import("./database").Database["public"]["Tables"]["event_entries"]["Row"];
export type Subscription = import("./database").Database["public"]["Tables"]["subscriptions"]["Row"];
