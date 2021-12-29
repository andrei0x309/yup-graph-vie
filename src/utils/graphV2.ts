/* eslint-disable */
// @ts-nocheck

import axios from 'axios';


const cacheDuration = 1800000;

function filterHostname (hostname) {
  const hostnames = ['youtube.com', 'twitter.com', 'reddit.com', 'foundation.app']
  const dic = {
    'youtube.com': {
      group: 'youtube',
      color: '#c4302b',
    },
    'twitter.com': {
      group: 'twitter',
      color: '#1da1f2',
    },
    'reddit.com': {
      group: 'reddit',
      color: 'orangered',
    },
    'foundation.app': {
      group: 'foundation',
      color: '#FFF1BD',
    }
  }
  const matchHost = hostnames.find(host => hostname.includes(host))
  return matchHost ? dic[matchHost] : {
    group: 'general',
    color: '#3a3a3a',
  }

}

export async function getSingleUserData (user, limit = 1000, bypassCache = false) {
  let fullData = [];
  const cache = JSON.parse(sessionStorage.getItem(user + '-pre'));
  if (cache && Date.now() - cache.timestamp < cacheDuration && !bypassCache) {
    fullData = [...fullData, ...cache.data];
  } else {
    await axios({
      method: 'get',
      url: `https://api.yup.io/votes/voter/${user}?start=0&limit=${limit}`,
    }).then(function (response) {
      console.log(response);
      const data = [];
      const voter = response.data[0].voter;
      response.data.forEach(element => {
        if (element.post?.caption) {
          data.push({
            caption: element.post.caption,
            voter,
            timestamp: element.timestamp || element.lastUpdated,
            postId: element.post["_id"]["postid"],
          });
        }
      });
      const cacheData = JSON.stringify({
        timestamp: Date.now(),
        data,
      });
      try {
        sessionStorage.setItem(user + '-pre', cacheData);
      } catch (err) {
        sessionStorage.clear();
        sessionStorage.setItem(user + '-pre', cacheData);
      }
      fullData = [...fullData, ...data];
    });
  }
  console.log(fullData);
  return fullData;
}


export function generateData (data) {
  let nodes = [];
  let links = [];
  data?.forEach(element => {
    if (nodes.length <= 2000) {
      let url;
      try {
        url = new URL(element.caption);
      } catch (e) {
        // console.log(e)
      }
      url = url
        ? filterHostname(url.hostname)
        : {
          group: 'general',
          color: '#3a3a3a',
        };
      if (element.caption) {
        nodes.push({
          id: element.caption,
          group: url.group,
          color: url.color,
          postId: element.postId,
        });
        nodes.push({
          id: element.voter,
          group: 'user',
          color: '#dadada',
        });
        links.push({
          source: element.voter,
          target: element.caption,
        });
      }
    }
  });
  nodes = [...new Map(nodes.map(item => [item['id'], item])).values()];
  return {
    nodes,
    links,
  };
}


export async function getUserDeepData (currentData, limit = 1000, bypassCache = false, loadingCallback = () => { }) {
  const nodes = [...currentData.nodes];
  console.log(nodes)
  const posts = nodes.filter(node => node.postId);
  let currentUserId = currentData.id;
  let limitNodes = limit
  let limitLinks = limit

  if (limitNodes === 0) limitNodes = 5000;
  if (limitLinks === 0) limitLinks = 5000;

  const retData = { nodes: [], links: [] };

  for (const node of posts) {
    const data = await getPostData(node.postId, node.id, bypassCache, loadingCallback);
    const votes = getPostVotes(data, node);
    retData.nodes = [...retData.nodes, ...votes.nodes];
    retData.links = [...retData.links, ...votes.links];
    if (retData.nodes.length > limitNodes) break;
    if (retData.links.length > limitLinks) break;
  }
  const uniqueNodesId = [];
  const uniqueNodes = [];
  retData.nodes.forEach(node => {
    if (!uniqueNodesId.includes(node.id)) {
      uniqueNodes.push(node);
      uniqueNodesId.push(node.id);
    }
  });
  retData.nodes = uniqueNodes;
  console.log(retData)
  return retData;
}

async function getPostData (id, caption, bypassCache = false, loadingCallback = () => { }) {
  let cache;
  if (!bypassCache) {
    cache = JSON.parse(sessionStorage.getItem(id + '-pre'));
  }
  if (cache && Date.now() - cache.timestamp < cacheDuration) {
    return cache.data;
  } else {
    let getCaption;
    if (!caption) {
      getCaption = await axios({
        method: 'get',
        url: `https://api.yup.io/posts/post/${id}`,
      }).then(function (response) {
        return response.data.caption;
      });
    }
    return axios({
      method: 'get',
      url: `https://api.yup.io/votes/post/${id}?start=0&limit=1000`,
    }).then(function (response) {
      console.log(response);
      var data = [];
      response.data.forEach(element => {
        data.push({
          caption: caption ? caption : getCaption,
          voter: element.voter,
          timestamp: element.timestamp,
          postId: id,
        });
      });
      let cacheData = JSON.stringify({
        timestamp: Date.now(),
        data: data,
      });

      loadingCallback(JSON.stringify(data));
      console.log(data);
      sessionStorage.setItem(id + '-pre', cacheData);
      return data;
    });
  }
}

function getPostVotes (data, node) {
  let nodes = [];
  let links = [];
  nodes.push(node);
  data.forEach(element => {
    if (element.caption === node.id) {
      nodes.push({
        id: element.voter,
        group: 'user',
        color: '#dadada',
      });
      links.push({
        source: element.voter,
        target: element.caption,
      });
    }
  });
  nodes = [...new Map(nodes.map(item => [item['id'], item])).values()];
  return {
    nodes,
    links,
  };
}

export function calcuateCollusionScore (data) {
  // Threshold for adding small penalties when overlaping votes are over 20 for 1000 links, 40 for 2000 links, ...
  const overlapPenalityThreshold = ~~(20 * (data.links.length / 1e3))
  // Add small bias for websites that have push notifications  
  const hasPushNotifBias = data.nodes.filter(node => node.group === 'twitter' || node.group === 'youtube').length

  const users = {}
  data.links.forEach(link => {
    if (!users[link.source]) users[link.source] = 1
    else users[link.source] += 1
  })

  const sortedUsers = Object.keys(users).sort(
    (a, b) => users[a] - users[b]
  ).slice(1).reduce((obj, key) => { obj[key] = users[key]; return obj }, {})

  const penalties = Object.keys(sortedUsers).filter(key => sortedUsers[key] >= overlapPenalityThreshold).length

  const nodesLen = data.nodes.length;
  const linksLen = data.links.length;
  // extract analyzed user form pool of users
  const userNodesLen = data.nodes.filter(node => node.group === 'user').length - 1;
  const votesNodesLen = nodesLen - userNodesLen;
  // Penaties are 5% of links
  const wheightedLinks = (data.links.length + penalties * (data.links.length / 20));
  return Number(((wheightedLinks + votesNodesLen) / (userNodesLen + hasPushNotifBias)).toFixed(2));
}