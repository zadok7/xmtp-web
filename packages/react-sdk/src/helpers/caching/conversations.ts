import type { Conversation, Client, InvitationContext } from "@xmtp/xmtp-js";
import type { Table } from "dexie";
import type Dexie from "dexie";
import type { ContentTypeMetadata, ContentTypeMetadataValues } from "./db";

export type CachedConversation<M = ContentTypeMetadata> = {
  context?: InvitationContext;
  createdAt: Date;
  id?: number;
  isReady: boolean;
  metadata?: M;
  peerAddress: string;
  topic: string;
  updatedAt: Date;
  walletAddress: string;
};

type SearchableProperties = Required<
  Pick<CachedConversation, "id" | "peerAddress" | "topic">
>;

type ToFunctionArgs<T> = {
  [P in keyof T]: [key: P, value: T[P]];
}[keyof T];

type GetCachedConversationBy = (
  ...args: [...ToFunctionArgs<SearchableProperties>, Dexie]
) => Promise<CachedConversationWithId | undefined>;

export type CachedConversationsTable = Table<CachedConversation, number>;

export type CachedConversationWithId = CachedConversation & {
  id: number;
};

/**
 * Retrieve a cached conversation by a given key and value
 *
 * @returns The cached conversation if found, otherwise `undefined`
 */
export const getCachedConversationBy: GetCachedConversationBy = async (
  key,
  value,
  db,
) => {
  const conversationsTable = db.table(
    "conversations",
  ) as CachedConversationsTable;
  const conversation = await conversationsTable
    .where(key)
    .equals(value)
    .first();
  return conversation ? (conversation as CachedConversationWithId) : undefined;
};

/**
 * Retrieve a cached conversation by topic
 *
 * @returns The cached conversation if found, otherwise `undefined`
 */
export const getCachedConversationByTopic = async (topic: string, db: Dexie) =>
  getCachedConversationBy("topic", topic, db);

/**
 * Retrieve a cached conversation by peer address
 *
 * @returns The cached conversation if found, otherwise `undefined`
 */
export const getCachedConversationByPeerAddress = async (
  peerAddress: string,
  db: Dexie,
) => getCachedConversationBy("peerAddress", peerAddress, db);

/**
 * Retrieve a conversation from the XMTP client by a topic
 *
 * @returns The conversation if found, otherwise `undefined`
 */
export const getConversationByTopic = async (
  topic: string,
  client: Client,
): Promise<Conversation | undefined> => {
  const conversations = await client.conversations.listFromCache();
  let conversation: Conversation | undefined;
  conversations.some((convo) => {
    if (convo.topic === topic) {
      conversation = convo;
      return true;
    }
    return false;
  });
  return conversation;
};

/**
 * Update properties of a cached conversation
 */
export const updateConversation = async (
  topic: string,
  update: Partial<
    Pick<CachedConversation, "updatedAt" | "isReady" | "metadata">
  >,
  db: Dexie,
) => {
  const conversationsTable = db.table(
    "conversations",
  ) as CachedConversationsTable;
  const existing = await conversationsTable
    .where("topic")
    .equals(topic)
    .first();
  if (existing) {
    await conversationsTable.update(existing, update);
  }
};

/**
 * Update metadata of a cached conversation using the specified namespace
 *
 * This is not meant to be called directly
 */
export const updateConversationMetadata = async (
  topic: string,
  namespace: string,
  data: ContentTypeMetadataValues,
  db: Dexie,
) => {
  const existing = await getCachedConversationByTopic(topic, db);
  if (existing) {
    const metadata = existing.metadata || {};
    metadata[namespace] = data;
    await updateConversation(topic, { metadata }, db);
  }
};

/**
 * Sets the `updatedAt` field of a cached conversation
 */
export const setConversationUpdatedAt = async (
  topic: string,
  updatedAt: CachedConversation["updatedAt"],
  db: Dexie,
) => {
  await updateConversation(topic, { updatedAt }, db);
};

/**
 * Check to see if a topic exists in the conversations cache
 */
export const hasTopic = async (topic: string, db: Dexie) => {
  const existing = await getCachedConversationByTopic(topic, db);
  return !!existing;
};

/**
 * Converts a Conversation from the XMTP network to its cached format
 *
 * @returns The conversation in cached format
 */
export const toCachedConversation = (
  conversation: Conversation,
  walletAddress: string,
) => ({
  context: conversation.context,
  createdAt: conversation.createdAt,
  isReady: false,
  peerAddress: conversation.peerAddress,
  topic: conversation.topic,
  updatedAt: conversation.createdAt,
  walletAddress,
});

/**
 * Save a conversation to the cache
 *
 * @returns The saved cached conversation with ID
 */
export const saveConversation = async (
  conversation: CachedConversation,
  db: Dexie,
) => {
  const conversations = db.table("conversations") as CachedConversationsTable;

  const existing = await conversations
    .where("topic")
    .equals(conversation.topic)
    .first();

  if (existing) {
    return existing as CachedConversationWithId;
  }

  // eslint-disable-next-line no-param-reassign
  conversation.id = await conversations.add(conversation);

  return conversation as CachedConversationWithId;
};
