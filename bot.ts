import Discord, { Channel, NewsChannel, TextBasedChannel } from "discord.js";
import rawSecrets from "./secrets.json";
import { Secrets, Settings } from "./types";
import rawSettings from "./settings.json";
import { TextChange } from "typescript";
const secrets: Secrets = rawSecrets;
const settings: Settings = rawSettings;

export const loginTest = () => {
  const client = new Discord.Client();

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("message", (msg) => {
    if (msg.content === "ping") {
      msg.reply("pong");
    }
  });

  client.login(secrets.discordToken);
};

export const getMessageFromChannel = async (): Promise<void> => {
  const client = new Discord.Client();

  client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log("Getting message from channel.");
    const channel = client.channels.cache.find(
      (c) => c.id === settings.channelId
    );
    if (channel.type !== "news")
      throw Error("Chosen channel is not a text channel.");
    const newsChannel: NewsChannel = channel as NewsChannel;
    var message = await newsChannel.messages.fetch(settings.messageId);
    if (!message) {
      throw Error(
        `Message with id ${settings.messageId} could not be found in channel id ${settings.channelId}.`
      );
    }
    console.log("Successfully fetched message!");
    const cachedReactions = message.reactions.cache;
    const reactions = await Promise.all(cachedReactions.map((r) => r.fetch()));
    const usersPerReaction = await Promise.all(
      reactions.map((r) => r.users.fetch())
    );
    const userIds: string[] = usersPerReaction.reduce<string[]>(
      (aggregate, value) => {
        value.forEach((v) => aggregate.push(v.id));
        return aggregate;
      },
      []
    );
    console.log(userIds);
    // const users = reactions.reduce<string[]>((aggregate, value): string[] => {
    //   value.users.cache.forEach(
    //     (u) => !aggregate.includes(u.id) && aggregate.push(u.id)
    //   );
    //   return aggregate;
    // }, []);
    // console.log(users);
  });

  client.login(secrets.discordToken);
};
