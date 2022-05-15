const { Client, Intents } = require("discord.js");
const discord = require("discord.js");
const axios = require("axios");
const conifg = require("./config1.json");
const configx = require("./conifg.json")
const {
  hexToCV,
  cvToJSON,
  standardPrincipalCV,
  cvToHex,
} = require("@stacks/transactions");

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});

bot.on("ready", () => console.log("yeah bitch Im in\n\n\n"));

async function rolesList(roleName) {
  const Guilds = await bot.guilds.fetch();
  const Guild = Guilds.map((guild) => guild.id)[0];
  const roles = await (await bot.guilds.fetch(Guild)).roles.fetch();

  let tatti;
  roles.filter((role) => {
    if (role.name === roleName) tatti = role.id;
  });
  return tatti;
}
async function userList(userName, u) {
  const Guilds = await bot.guilds.fetch();
  const Guild = Guilds.map((guild) => guild.id)[0];
  const member = await (await bot.guilds.fetch(Guild)).members.fetch();
  let tag = u.slice(u.indexOf("#") + 1);
  console.log(tag);
  let tatti;
  member.filter((user) => {
    if (
      user.user.username === userName &&
      parseInt(user.user.discriminator) === parseInt(tag)
    ) {
      tatti = user.user.id;
    }
  });
  return tatti;
}

async function romaGet(address) {
  const romaData = await axios.get(`https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${address}/balances`)
  // let romaKey = Object.keys(romaData.data.fungible_tokens)[0]
  let romaKey = "SP2A665S3H6FVMZSY4VJ17ESXX21CGS0A32984B1H.romatoken::ROMA"
  console.log(`Roma coins : ${(parseInt((romaData.data.fungible_tokens[romaKey].balance)) / 1000000)}`)
  console.log(romaKey)
  return (parseInt((romaData.data.fungible_tokens[romaKey].balance)) / 1000000)

}

async function contractGet(principal) {
  let args;
  let stakedNfts = 0;
  let ancestor;
  let friend;
  let upgrade;			  
  try { args = standardPrincipalCV(principal); }
  catch (e) {
    console.log(e)
    return 0;
  }
  const config = {
    method: "post",
    url: `https://stacks-node-api.stacks.co/v2/contracts/call-read/SP2A665S3H6FVMZSY4VJ17ESXX21CGS0A32984B1H/staker-v2/get-address-staking-nfts`,
    data: {
      sender: "SP194P2RXMG6Y6A33X5M6GNJC9P2Y1NCAM4CXPY2H", //SP25V7GPH9ZZFBATCRQV6BFQR5SFJ8SVY3HBBDWRB
      arguments: [`${cvToHex(args)}`],
    },
  };
  const config2 = {
    method: "get",
    url: `https://stacks-node-api.mainnet.stacks.co/extended/v1/address/${principal}/balances`,
  };

  try {
    let res = await axios(config);
    let res2 = await axios(config2);
    if (!res.data.okay && res.data.cause.includes('Unchecked(CostBalanceExceeded(ExecutionCost')) {
      stakedNfts += 30;
    }
    else {
      let cv = hexToCV(res.data.result);
      stakedNfts = cvToJSON(cv).value.value.length;
      ancestor = false;
      friend = false;
      cvToJSON(cv).value.value.forEach(i => {
        if ((i.value.value['nft-collection'].value).includes('Punks-Army-Friends-NFTs'))
          friend = true;
        if ((i.value.value['nft-collection'].value).includes('Punks-Army-Ancestors-NFTs'))
          ancestor = true;
		if ((i.value.value['nft-collection'].value).includes('Punks-Army-NFTs') && parseInt(i.value.value['nft-id'].value) >= 1000)
          upgrade = true;
      })
    }
    Object.keys(res2.data.non_fungible_tokens).forEach((i) => {
      if (
        i.includes("Punks-Army-Ancestors-NFTs") ||
        i.includes("Punks-Army-Friends-NFTs") ||
        i.includes("Punks-Army-NFTs")
      ) {
        if (
          i.includes("Punks-Army-Ancestors-NFTs") &&
          res2.data.non_fungible_tokens[i].count != 0
        )
          ancestor = true;
        if (
          i.includes("Punks-Army-Friends-NFTs") &&
          res2.data.non_fungible_tokens[i].count != 0
        )
          friend = true;
        stakedNfts += parseInt(res2.data.non_fungible_tokens[i].count);
      }
    });
    console.log('yes')
    console.log(`total nfts + staked : ${stakedNfts}`);
    console.log(`Ancestor nft : ${ancestor}`);
    console.log(`Friend nft : ${friend}`);
    let list = [stakedNfts, ancestor, friend, upgrade];
    return list;
  } catch (e) {
    console.log(e);
  }
}

async function nftRoleGiver(message) {
  let embed = new discord.MessageEmbed();
  let nfts;
  let userId;
  let papu;
  if (message.author != bot.user) {
    try {
      const add = message.content.indexOf(">") + 3;
      const contract = message.content.slice(add - 1);
      const user = message.content.slice(0, add - 3);
      // console.log(`User ID : ${user.match(/\d+/)[0]}`);
      papu = user.match(/\d+/)[0];
      const Guilds = await bot.guilds.fetch();
      const Guild = Guilds.map((guild) => guild.id)[0];
      userId = await (await bot.guilds.fetch(Guild)).members.fetch(papu);
      let principalA = contract
      nfts = await contractGet(principalA);
      console.log(nfts)
      console.log(papu)
    }
    catch (e) {
      // console.log(e)
      // embed.setColor("#17dada");
      // embed.setDescription("Please Put a Proper Wallet contract");
      // message.channel.send({ embeds: [embed] });
      return 0;
    }
    try {
      if (
        nfts[0] >= conifg["Punk Holder"] &&
        nfts[0] < conifg["Punk Gang Holder"]
      ) {
        userId.roles.add(await rolesList("Punk Holder"));
        if (
          userId.roles.cache.some((role) => role.name === "Kraken") ||
          userId.roles.cache.some((role) => role.name === "Punk Gang Holder") ||
          userId.roles.cache.some((role) => role.name === "Whale") ||
          userId.roles.cache.some((role) => role.name === "Super Whale") ||
          userId.roles.cache.some((role) => role.name === "Gold Kraken")
        ) {
          userId.roles.remove(await rolesList("Punk Gang Holder"));
          userId.roles.remove(await rolesList("Whale"));
          userId.roles.remove(await rolesList("Super Whale"));
          userId.roles.remove(await rolesList("Kraken"));
          userId.roles.remove(await rolesList("Gold Kraken"));
        }
        console.log("\n\nRole Given : Punk Holder")
        embed.setColor("#17dada");
        embed.setDescription(`Punk Holder given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });

      } else if (
        nfts[0] >= conifg["Punk Gang Holder"] &&
        nfts[0] < conifg["Whale"]
      ) {
        userId.roles.add(await rolesList("Punk Gang Holder"));
        if (
          userId.roles.cache.some((role) => role.name === "Punk Holder") ||
          userId.roles.cache.some((role) => role.name === "Whale") ||
          userId.roles.cache.some((role) => role.name === "Super Whale") ||
          userId.roles.cache.some((role) => role.name === "Kraken") ||
          userId.roles.cache.some((role) => role.name === "Gold Kraken")
        ) {
          userId.roles.remove(await rolesList("Punk Holder"));
          userId.roles.remove(await rolesList("Whale"));
          userId.roles.remove(await rolesList("Super Whale"));
          userId.roles.remove(await rolesList("Kraken"));
          userId.roles.remove(await rolesList("Gold Kraken"));
        }
        console.log("\n\nRole Given : Punk Gang Holder")
        embed.setColor("#17dada");
        embed.setDescription(`Punk Gang Holder given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });

      } else if (
        nfts[0] >= conifg["Whale"] &&
        nfts[0] < conifg["Super Whale"]
      ) {
        userId.roles.add(await rolesList("Whale"));
        if (
          userId.roles.cache.some((role) => role.name === "Punk Holder") ||
          userId.roles.cache.some((role) => role.name === "Punk Gang Holder") ||
          userId.roles.cache.some((role) => role.name === "Super Whale") ||
          userId.roles.cache.some((role) => role.name === "Kraken") ||
          userId.roles.cache.some((role) => role.name === "Gold Kraken")
        ) {
          userId.roles.remove(await rolesList("Punk Holder"));
          userId.roles.remove(await rolesList("Punk Gang Holder"));
          userId.roles.remove(await rolesList("Super Whale"));
          userId.roles.remove(await rolesList("Kraken"));
          userId.roles.remove(await rolesList("Gold Kraken"));

        }
        console.log("\n\nRole Given : Whale")
        embed.setColor("#17dada");
        embed.setDescription(`Whale given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });

      } else if (
        nfts[0] >= conifg["Super Whale"] &&
        nfts[0] < conifg["Kraken"]
      ) {
        userId.roles.add(await rolesList("Super Whale"));
        if (
          userId.roles.cache.some((role) => role.name === "Punk Holder") ||
          userId.roles.cache.some((role) => role.name === "Punk Gang Holder") ||
          userId.roles.cache.some((role) => role.name === "Whale") ||
          userId.roles.cache.some((role) => role.name === "Kraken") ||
          userId.roles.cache.some((role) => role.name === "Gold Kraken")
        ) {
          userId.roles.remove(await rolesList("Punk Holder"));
          userId.roles.remove(await rolesList("Punk Gang Holder"));
          userId.roles.remove(await rolesList("Whale"));
          userId.roles.remove(await rolesList("Kraken"));
          userId.roles.remove(await rolesList("Gold Kraken"));

        }
        console.log("\n\nRole Given : Super Whale")
        embed.setColor("#17dada");
        embed.setDescription(`Super Whale given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });

      } else if (nfts[0] >= conifg["Kraken"]) {
        userId.roles.add(await rolesList("Kraken"));
        if (
          userId.roles.cache.some((role) => role.name === "Punk Holder") ||
          userId.roles.cache.some((role) => role.name === "Punk Gang Holder") ||
          userId.roles.cache.some((role) => role.name === "Whale") ||
          userId.roles.cache.some((role) => role.name === "Super Whale") ||
          userId.roles.cache.some((role) => role.name === " Gold Kraken")

        ) {
          userId.roles.remove(await rolesList("Punk Holder"));
          userId.roles.remove(await rolesList("Punk Gang Holder"));
          userId.roles.remove(await rolesList("Whale"));
          userId.roles.remove(await rolesList("Super Whale"));
          userId.roles.remove(await rolesList("Gold Kraken"));

        }
        console.log("\n\nRole Given : Kraken")
        embed.setColor("#17dada");
        embed.setDescription(`Kraken given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      }

      else if (nfts[0] >= conifg["Kraken"] && nfts[1] && nfts[2]) {
        userId.roles.add(await rolesList("Gold Kraken"));
        if (
          userId.roles.cache.some((role) => role.name === "Punk Holder") ||
          userId.roles.cache.some((role) => role.name === "Punk Gang Holder") ||
          userId.roles.cache.some((role) => role.name === "Whale") ||
          userId.roles.cache.some((role) => role.name === "Super Whale") ||
          userId.roles.cache.some((role) => role.name === "Kraken")

        ) {
          userId.roles.remove(await rolesList("Punk Holder"));
          userId.roles.remove(await rolesList("Punk Gang Holder"));
          userId.roles.remove(await rolesList("Whale"));
          userId.roles.remove(await rolesList("Super Whale"));
          userId.roles.remove(await rolesList("Kraken"));
        }
        console.log("\n\nRole Given : Gold Kraken")
        embed.setColor("#17dada");
        embed.setDescription(`Gold Kraken given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      }

      if (nfts[1]) {
        userId.roles.add(await rolesList("Ancestor"));
        console.log("Role given: Ancestors");
        embed.setColor("#17dada");
        embed.setDescription(`Ancestors given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      } else {
        if (userId.roles.cache.some((role) => role.name === "Ancestor"))
          userId.roles.remove(await rolesList("Ancestor"));
      }
      if (nfts[2]) {
        userId.roles.add(await rolesList("Friends Holder"));
        console.log("Role given: Friends");
        embed.setColor("#17dada");
        embed.setDescription(`Friends Holder given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      } else {
        if (userId.roles.cache.some((role) => role.name === "Friends"))
          userId.roles.remove(await rolesList("Friends Holder"));
        
      }
      if (nfts[3]) {
        userId.roles.add(await rolesList("Punk Upgraded"))
        console.log("Role given: Punk Upgraded");
        embed.setColor("#17dada");
        embed.setDescription(`Punk Upgraded given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      
      
      } else {
        if (userId.roles.cache.some((role) => role.name === "Punk Upgraded"))
          userId.roles.remove(await rolesList("Punk Upgraded"));
      }
    } catch (e) {
      console.log(e)
    }
  }
}

async function roleGiver(message) {
  let embed = new discord.MessageEmbed()
  let romaCoin;
  let userId;
  let papu;
  if (message.author != bot.user) {
    try {
      const add = message.content.indexOf(">") + 3;
      const contract = message.content.slice(add - 1);
      const user = message.content.slice(0, add - 3);
      // console.log(`User ID : ${user.match(/\d+/)[0]}`);
      papu = user.match(/\d+/)[0];
      const Guilds = await bot.guilds.fetch();
      const Guild = Guilds.map((guild) => guild.id)[0];
      userId = await (await bot.guilds.fetch(Guild)).members.fetch(papu);
      let principalA = contract
      romaCoin = await romaGet(principalA)
    }
    catch (e) {
      // console.log(e)
      embed.setColor("#17dada");
      embed.setDescription("Please Put a Proper Wallet contract");
      message.channel.send({ embeds: [embed] });

      return 0;
    }
    try {
      if (romaCoin > configx['Maximus'] && romaCoin < configx['Tiberius']) {

        userId.roles.add(await rolesList('Maximus'))
        if (userId.roles.cache.some(role => role.name === 'Tiberius') || userId.roles.cache.some(role => role.name === 'Caesar') || userId.roles.cache.some(role => role.name === 'Crassus')) {
          userId.roles.remove(await rolesList('Tiberius'))
          userId.roles.remove(await rolesList('Caesar'))
          userId.roles.remove(await rolesList('Crassus'))

        }
        console.log('Role given : Maximus')
        embed.setColor("#17dada");
        embed.setDescription(`Maximus given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      } else if (romaCoin >= configx['Tiberius'] && romaCoin < configx['Caesar']) {

        userId.roles.add(await rolesList('Tiberius'))
        if (userId.roles.cache.some(role => role.name === 'Maximus') || userId.roles.cache.some(role => role.name === 'Caesar') || userId.roles.cache.some(role => role.name === 'Crassus')) {
          userId.roles.remove(await rolesList('Maximus'))
          userId.roles.remove(await rolesList('Caesar'))
          userId.roles.remove(await rolesList('Crassus'))

        }
        console.log('\nRole given : Tiberius')
        embed.setColor("#17dada");
        embed.setDescription(`Tiberius to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      } else if (romaCoin >= configx['Caesar'] && romaCoin < configx['Crassus']) {

        userId.roles.add(await rolesList('Caesar'))
        if (userId.roles.cache.some(role => role.name === 'Maximus') || userId.roles.cache.some(role => role.name === 'Tiberius') || userId.roles.cache.some(role => role.name === 'Crassus')) {
          userId.roles.remove(await rolesList('Maximus'))
          userId.roles.remove(await rolesList('Tiberius'))
          userId.roles.remove(await rolesList('Crassus'))

        }
        console.log('\nRole given : Caesar')
        embed.setColor("#17dada");
        embed.setDescription(`Caesar given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      } else if (romaCoin >= configx['Crassus']) {

        userId.roles.add(await rolesList('Crassus'))
        if (userId.roles.cache.some(role => role.name === 'Maximus') || userId.roles.cache.some(role => role.name === 'Tiberius') || userId.roles.cache.some(role => role.name === 'Caesar')) {
          userId.roles.remove(await rolesList('Maximus'))
          userId.roles.remove(await rolesList('Tiberius'))
          userId.roles.remove(await rolesList('Caesar'))

        }
        console.log('\nRole given : Crassus')
        embed.setColor("#17dada");
        embed.setDescription(`Crassus given to <@${papu}>`);
        message.channel.send({ embeds: [embed] });
      }
    } catch (e) {
      console.log(e)
      embed.setColor("#17dada");
      embed.setDescription("Please Put a Proper Wallet contract");
      message.channel.send({ embeds: [embed] });
    }
  }
}

bot.on("messageCreate", async (message) => {
  let embed = new discord.MessageEmbed()
  if (message.channel.id == "969676035236958248") {
    try {
      roleGiver(message);
      nftRoleGiver(message);
    }
    catch (e) {
      embed.setColor("#17dada");
      embed.setDescription("Please Put a Proper Wallet contract");
      message.channel.send({ embeds: [embed] });
    }
  }
});
bot.login("OTU5NDQ1MTM2ODg5MjE3MDc1.Ykb-6g.DhcSlL__l9vB0ryEsZToGtjwZlo");
