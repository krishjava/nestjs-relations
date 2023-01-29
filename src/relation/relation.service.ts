import { Injectable } from '@nestjs/common';
import { CreateRelationDto } from './dto/create-relation.dto';
import { UpdateRelationDto } from './dto/update-relation.dto';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class RelationService {
  async performHeavyTask() {
    for (let i = 1; i <= 500000; i++) {
      console.log('done, ', i);
      // await this.doTask(i);
    }
    return { message: 'pass' };
  }

  doTask(i) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('done ,', i);
        resolve('done ' + i);
      }, 3000);
    });
  }

  getTBID(tbAlisas) {
    return new Promise(async (resolve, reject) => {
      await axios
        .get('https://trailblazer.me/id/' + tbAlisas, {
          headers: {
            'Accept-Encoding': 'gzip=true', // gzip=true
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const responseText = response.data;
            const pos = responseText.indexOf('var profileData = ');
            if (pos != -1) {
              const profileResult = responseText.substring(
                pos + 30,
                responseText.indexOf('communityUrl') + 42,
              );
              const finalProfileResult = JSON.parse(
                profileResult.replace(/\\/g, ''),
              );
              const isProfilePublic =
                finalProfileResult?.profileUser?.Is_Public_Profile__c;
              if (!isProfilePublic) {
                reject({ code: 400, message: 'profile is not public' });
              }
              resolve(finalProfileResult);
            } else {
              reject({ code: 404, message: 'profile not found' });
            }
          }
        })
        .catch((error) => {
          // console.log('tbid error ' + error);
          if (error.data === undefined) {
            reject({ code: 400, message: 'Something went wrong' });
          }
          reject({ code: 412, message: 'profile url is not available' });
        });
    });
  }

  async getRank(tbId) {
    // console.log('getrank ' + tbId);
    const queryVariables = {
      queryProfile: true,
      trailblazerId: tbId,
    };

    return new Promise(async (resolve, reject) => {
      await axios({
        url: 'https://profile.api.trailhead.com/graphql',
        method: 'POST',
        data: {
          query: `query GetTrailheadRank($trailblazerId: String, $queryProfile: Boolean!) {
              profile(trailblazerId: $trailblazerId) @include(if: $queryProfile) {    
                ... on PublicProfile {      ...PublicProfile    }    
                ... on PrivateProfile {      __typename    }  }
        }
  
        fragment TrailheadRank on TrailheadRank {  __typename  title  requiredPointsSum  requiredBadgesCount  imageUrl}fragment PublicProfile on PublicProfile {  __typename  trailheadStats {    __typename    earnedPointsSum    earnedBadgesCount    completedTrailCount    rank {      ...TrailheadRank    }    nextRank {      ...TrailheadRank    }  }}`,
          variables: queryVariables,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            //   console.log(response.data);
            resolve(response.data);
          }
        })
        .catch((error) => {
          if (error.data === undefined) {
            reject({ code: 400, message: 'Something went wrong' });
          }
          // console.log(error.response.status);
          // console.log(error.response.statusText);
          reject({ code: 500, message: 'some internal error' });
        });
    });
  }

  async getBadges(trailblazerId, count) {
    return new Promise(async (resolve, reject) => {
      await axios({
        url: 'https://profile.api.trailhead.com/graphql',
        method: 'POST',
        data: {
          query: `query GetTrailheadBadges($trailblazerId: String, $queryProfile: Boolean = false, $count: Int = 8, $after: String = null, $filter: AwardTypeFilter = null) {  profile(trailblazerId: $trailblazerId) @include(if: $queryProfile) {    __typename    ... on PublicProfile {      ...ProfileBadges    }  }}
    
            fragment EarnedAward on EarnedAwardBase {  __typename  id  award {    __typename    id    title    type    icon    content {      __typename      webUrl      description    }  }}fragment EarnedAwardSelf on EarnedAwardSelf {  __typename  id  award {    __typename    id    title    type    icon    content {      __typename      webUrl      description    }  }  earnedAt  earnedPointsSum}fragment StatsBadgeCount on TrailheadProfileStats {  __typename  earnedBadgesCount  superbadgeCount}fragment ProfileBadges on PublicProfile {  __typename  trailheadStats {    ... on TrailheadProfileStats {      ...StatsBadgeCount    }  }  earnedAwards(first: $count, after: $after, awardType: $filter) {    edges {      node {        ... on EarnedAwardBase {          ...EarnedAward        }        ... on EarnedAwardSelf {          ...EarnedAwardSelf        }      }    }    pageInfo {      ...PageInfoBidirectional    }  }}fragment PageInfoBidirectional on PageInfo {  __typename  endCursor  hasNextPage  startCursor  hasPreviousPage}`,
          variables: {
            queryProfile: true,
            count: count,
            trailblazerId: trailblazerId,
          },
        },
      })
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          }
        })
        .catch((error) => {
          if (error.data === undefined) {
            reject({ code: 400, message: 'Something went wrong' });
          }
          // console.log(error.response.status);
          // console.log(error.response.statusText);
          reject({ code: 500, message: 'some internal error' });
        });
    });
  }

  async getSuperbadge(trailblazerId, count) {
    return new Promise(async (resolve, reject) => {
      axios({
        url: 'https://profile.api.trailhead.com/graphql',
        method: 'POST',
        data: {
          query: `query GetTrailheadBadges($trailblazerId: String, $queryProfile: Boolean = false, $count: Int = 8, $after: String = null, $filter: AwardTypeFilter = null) {  profile(trailblazerId: $trailblazerId) @include(if: $queryProfile) {    __typename    ... on PublicProfile {      ...ProfileBadges    }  }}
          fragment EarnedAward on EarnedAwardBase {  __typename  id  award {    __typename    id    title    type    icon    content {      __typename      webUrl      description    }  }}fragment EarnedAwardSelf on EarnedAwardSelf {  __typename  id  award {    __typename    id    title    type    icon    content {      __typename      webUrl      description    }  }  earnedAt  earnedPointsSum}fragment StatsBadgeCount on TrailheadProfileStats {  __typename  earnedBadgesCount  superbadgeCount}fragment ProfileBadges on PublicProfile {  __typename  trailheadStats {    ... on TrailheadProfileStats {      ...StatsBadgeCount    }  }  earnedAwards(first: $count, after: $after, awardType: $filter) {    edges {      node {        ... on EarnedAwardBase {          ...EarnedAward        }        ... on EarnedAwardSelf {          ...EarnedAwardSelf        }      }    }    pageInfo {      ...PageInfoBidirectional    }  }}fragment PageInfoBidirectional on PageInfo {  __typename  endCursor  hasNextPage  startCursor  hasPreviousPage}`,
          variables: {
            queryProfile: true,
            count: count,
            filter: 'SUPERBADGE',
            trailblazerId: trailblazerId,
          },
        },
      })
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          }
        })
        .catch((error) => {
          if (error.data === undefined) {
            reject({ code: 400, message: 'Something went wrong' });
          }
          // console.log(error.response.status);
          // console.log(error.response.statusText);
          reject({ code: 500, message: 'some internal error' });
        });
    });
  }

  async getCertificate(trailblazerId, alias) {
    console.log(trailblazerId + '' + alias);

    const formData = new FormData();
    formData.append(
      'aura.context',
      `{"mode":"PROD","fwuid":"tr2UlkrAHzi37ijzEeD2UA","app":"c:ProfileApp","loaded":{"APPLICATION@markup://c:ProfileApp":"HfhXxjr0MHAik6FxcDBkcA"},"dn":[],"globals":{"srcdoc":true},"uad":true}`,
    );
    formData.append(
      'aura.token',
      `eyJub25jZSI6IlluUjY1Qmh6T0xqNm5NLVZPSW1xelBiV3lMQTFkYkR1UUtEbjk1M0ExTlVcdTAwM2QiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IntcInRcIjpcIjAwRDFJMDAwMDA0TEhSNlwiLFwidlwiOlwiMDJHMUkwMDAwMDBWd1Y1XCIsXCJhXCI6XCJjYWltYW5zaWduZXJcIn0iLCJjcml0IjpbImlhdCJdLCJpYXQiOjE2NzAyMTY2NDQ4MzgsImV4cCI6MH0=..xVnCB0QRqjlS98wT-rtDeTfXkuh4BwMekK9ovfXXSOo=`,
    );
    formData.append(
      'message',
      `{"actions":[{"id":"7;a","descriptor":"aura://ApexActionController/ACTION$execute","callingDescriptor":"UNKNOWN","params":{"namespace":"","classname":"AchievementService","method":"fetchAchievements","params":{"userId":"${trailblazerId}","countryCode":"en_US","featureAdditionalCerts":true},"cacheable":false,"isContinuation":false}}]}`,
    );
    // formData.append('aura.pageURI', '/id/' + alias);

    return new Promise(async (resolve, reject) => {
      await axios({
        url: 'https://trailblazer.me/aura?r=0&aura.ApexAction.execute=1',
        method: 'POST',
        headers: {
          'Accept-Encoding': 'gzip=true, deflate, br', // gzip=true
          'Content-Type': 'multipart/form-data',
        },
        params: {
          r: 0,
          'aura.ApexAction.execute': 1,
        },
        data: {
          formData,
        },
        transformRequest: (data, error) => {
          return formData;
        },
      })
        .then((response) => {
          if (response.status === 200) {
            resolve(response.data);
          }
        })
        .catch((error) => {
          if (error.data === undefined) {
            reject({ code: 400, message: 'Something went wrong' });
          }
          // console.log(error.response.status);
          // console.log(error.response.statusText);
          reject({ code: 400, message: 'Something went wrong' });
        });
    });
  }

  create(createRelationDto: CreateRelationDto) {
    return 'This action adds a new relation';
  }

  findAll() {
    return `This action returns all relation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} relation`;
  }

  update(id: number, updateRelationDto: UpdateRelationDto) {
    return `This action updates a #${id} relation`;
  }

  remove(id: number) {
    return `This action removes a #${id} relation`;
  }
}
