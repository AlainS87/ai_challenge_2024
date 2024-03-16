const express = require('express')
const request = require('request');
const dotenv = require('dotenv');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

// 在其他中间件注册之前注册 CORS 中间件

const port = 5100

global.access_token = ''

dotenv.config()

var spotify_client_id = '87fdf22afba448b5a906039359ba4630'
var spotify_client_secret = '72db1e5be9414939b5fa695ebdc76e48'

var spotify_redirect_uri = 'http://localhost:3000/auth/callback'

const spotifyApi = new SpotifyWebApi({
  clientId: spotify_client_id,
  clientSecret: spotify_client_secret,
  redirectUri: spotify_redirect_uri
});

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();
app.use(cors());
app.use(express.json());
app.get('/auth/login', (req, res) => {

  var scope = ["streaming user-read-email user-read-private", 'playlist-modify-public',
    'playlist-modify-private'];
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  })
  console.log("start")
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

app.get('/auth/callback', (req, res) => {

  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true
  };
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      spotifyApi.setAccessToken(access_token);
      res.redirect('/')
    }
  });

})

app.get('/auth/token', (req, res) => {
  console.log(access_token)
  spotifyApi.setAccessToken(access_token);
  res.json({ access_token: access_token })
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

app.get('/recommendations', (req, res) => {
  // 从查询参数中获取用户信息
  const { mood, age, mbti, gender, job, zodiac, relationshipStatus } = req.query;

  // 根据心情选择合适的种子流派
  const seed_genres = moodToGenres(mood);
  console.log(seed_genres);

  // 根据年龄、性格等信息进一步调整音乐特征参数
  const { target_valence,
    target_energy,
    target_danceability,
    target_popularity,
    target_speechiness,
    target_acousticness,
    target_instrumentalness } = userInfoToMusicFeatures(mood, age, mbti, gender, job, zodiac, relationshipStatus);

  // 构建推荐API的请求选项
  const recommendOptions = {
    url: 'https://api.spotify.com/v1/recommendations',
    qs: {
      seed_genres: seed_genres.slice(0, 5).join(','),
      target_valence: target_valence,
      target_energy: target_energy,
      target_danceability: target_danceability,
      target_popularity: target_popularity,
      target_speechiness: target_speechiness,
      target_acousticness: target_acousticness,
      target_instrumentalness: target_instrumentalness
      // 根据需要添加更多音乐特征参数
    },
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    json: true
  };

  // 调用Spotify推荐API
  request.get(recommendOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // 发送推荐的歌曲回客户端
      res.json(body.tracks);
    } else {
      // 错误处理
      res.status(response.statusCode).json({ error: error });
    }
  });
});


function userInfoToMusicFeatures(mood, age, mbti, gender, zodiac, relationshipStatus) {
  let target_valence = 0.5;
  let target_energy = 0.5;
  let target_danceability = 0.5;
  let target_popularity = 50; // 假设一个中等的流行度
  let target_speechiness = 0.5;
  let target_acousticness = 0.5;
  let target_instrumentalness = 0.5;

  // MBTI性格类型对音乐特征的影响
  if (['ESTP', 'ESFP', 'ENFP', 'ENTP'].includes(mbti)) {
    target_danceability += 0.1;
    target_energy += 0.1;
  } else if (['ISTJ', 'ISFJ', 'INTJ', 'INFJ'].includes(mbti)) {
    target_instrumentalness += 0.1;
    target_acousticness += 0.1;
  }

  // 年龄对流行度和声学性的影响
  if (age < 25) {
    target_popularity += 10;
    target_danceability += 0.1;
  } else if (age > 50) {
    target_popularity -= 10;
    target_acousticness += 0.1;
  }

  // 性别对语言表达性的影响
  if (gender == 'Female') {
    target_speechiness += 0.05;
  } else if (gender == 'Male') {
    target_speechiness -= 0.05;
  }

  // 星座对情感值和能量的影响
  const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
  const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];

  if (fireSigns.includes(zodiac)) {
    target_energy += 0.1;
    target_danceability += 0.1;
  } else if (waterSigns.includes(zodiac)) {
    target_valence -= 0.1;
    target_acousticness += 0.1;
  }

  // 感情状态对舞曲能力和器乐性的影响
  switch (relationshipStatus) {
    case 'Single':
      target_danceability += 0.1;
      break;
    case 'In a relationship':
    case 'Married':
      target_valence += 0.1;
      break;
    case 'Divorced':
    case 'Separated':
      target_instrumentalness += 0.1;
      break;
    case 'Long distance':
      target_acousticness += 0.1;
      break;
  }

  // 确保所有特征值都在合理范围内
  target_valence = Math.min(Math.max(target_valence, 0), 1);
  target_energy = Math.min(Math.max(target_energy, 0), 1);
  target_danceability = Math.min(Math.max(target_danceability, 0), 1);
  target_popularity = Math.min(Math.max(target_popularity, 0), 100);
  target_speechiness = Math.min(Math.max(target_speechiness, 0), 1);
  target_acousticness = Math.min(Math.max(target_acousticness, 0), 1);
  target_instrumentalness = Math.min(Math.max(target_instrumentalness, 0), 1);

  return {
    target_valence,
    target_energy,
    target_danceability,
    target_popularity,
    target_speechiness,
    target_acousticness,
    target_instrumentalness
  };
}



function moodToGenres(mood) {
  const moodGenresMap = {
    'Aflutter': ['ambient', 'classical', 'new-age', 'chill', 'indie-pop', 'electro'],
    'Emotional': ['blues', 'soul', 'r-n-b', 'emo', 'singer-songwriter', 'piano'],
    'Melancholy': ['sad', 'ambient', 'classical', 'indie', 'folk', 'piano'],
    'Aloof': ['ambient', 'chill', 'indie', 'electronic', 'trip-hop', 'deep-house'],
    'Enthused': ['pop', 'dance', 'electro', 'happy', 'edm', 'pop-film'],
    'Miffy': ['punk', 'rock', 'grunge', 'hardcore', 'metal', 'alt-rock'],
    'Moody': ['blues', 'jazz', 'r-n-b', 'indie', 'alternative', 'soul'],
    'Mournful': ['classical', 'sad', 'blues', 'singer-songwriter', 'ambient', 'piano'],
    'Mysterious': ['ambient', 'electronic', 'trip-hop', 'indie', 'alternative', 'soundtracks'],
    'Nervous': ['electronic', 'punk', 'rock', 'metal', 'hardcore', 'drum-and-bass'],
    'Neurotic': ['punk', 'rock', 'indie', 'alternative', 'electro', 'grunge'],
    'Numb': ['ambient', 'chill', 'electronic', 'deep-house', 'dubstep', 'indie'],
    'Ominous': ['soundtracks', 'ambient', 'dark-ambient', 'electronic', 'industrial', 'trip-hop'],
    'On edge': ['punk', 'hardcore', 'metal', 'hard-rock', 'electronic', 'drum-and-bass'],
    'Ornery': ['rock', 'punk', 'alt-rock', 'grunge', 'metal', 'hard-rock'],
    'Pessimistic': ['blues', 'singer-songwriter', 'folk', 'indie', 'sad', 'ambient'],
    'Petrified': ['soundtracks', 'ambient', 'classical', 'electronic', 'industrial', 'dark-ambient'],
    'Petulant': ['punk', 'alt-rock', 'rock', 'indie', 'electronic', 'grunge'],
    'Pride': ['pop', 'rock', 'anthems', 'singer-songwriter', 'indie-pop', 'happy'],
    'Queasy': ['ambient', 'electronic', 'chill', 'trip-hop', 'indie', 'lo-fi'],
    'Ravenous': ['metal', 'hard-rock', 'punk', 'electronic', 'drum-and-bass', 'hardcore'],
    'Reflective': ['ambient', 'classical', 'singer-songwriter', 'indie', 'folk', 'jazz'],
    'Restless': ['rock', 'indie', 'punk', 'electronic', 'dance', 'alt-rock'],
    'Romantic': ['romance', 'pop', 'r-n-b', 'singer-songwriter', 'classical', 'jazz'],
    'Serenity': ['ambient', 'new-age', 'classical', 'chill', 'acoustic', 'instrumental'],
    'Snappy': ['pop', 'funk', 'dance', 'hip-hop', 'electro', 'disco'],
    'Starved': ['electronic', 'indie', 'alt-rock', 'metal', 'punk', 'hardcore'],
    'Tense': ['rock', 'metal', 'electronic', 'hard-rock', 'industrial', 'drum-and-bass'],
    'Touchy': ['blues', 'r-n-b', 'soul', 'indie', 'alternative', 'folk'],
    'Unattached': ['indie', 'alternative', 'electronic', 'ambient', 'chill', 'trip-hop'],
    'Unpredictable': ['experimental', 'indie', 'alternative', 'electronic', 'avant-garde', 'progressive-rock'],
    'Vacant': ['ambient', 'instrumental', 'chill', 'electronic', 'classical', 'new-age'],
    'Volatile': ['metal', 'hardcore', 'punk', 'hard-rock', 'electronic', 'drum-and-bass'],
    'Voracious': ['metal', 'hard-rock', 'punk', 'electro', 'edm', 'drum-and-bass'],
    'Whimsical': ['indie-pop', 'folk', 'alternative', 'chill', 'acoustic', 'singer-songwriter'],
    'Worried': ['blues', 'ambient', 'classical', 'singer-songwriter', 'indie', 'folk'],
    'Yearning': ['r-n-b', 'soul', 'pop', 'indie', 'folk', 'singer-songwriter'],
    'Angry': ['metal', 'punk', 'hard-rock', 'grunge', 'hardcore', 'death-metal'],
    'Antsy': ['electro', 'edm', 'drum-and-bass', 'dance', 'punk', 'indie-rock'],
    'Avid': ['rock', 'pop', 'indie', 'electronic', 'edm', 'jazz'],
    'Awe': ['ambient', 'classical', 'post-rock', 'cinematic', 'electronic', 'new-age'],
    'Bitter': ['blues', 'punk', 'alt-rock', 'grunge', 'metal', 'hardcore'],
    'Blank': ['ambient', 'instrumental', 'chillout', 'electronic', 'minimal', 'downtempo'],
    'Blue': ['blues', 'soul', 'r-n-b', 'folk', 'singer-songwriter', 'acoustic'],
    'Calm': ['ambient', 'acoustic', 'classical', 'new-age', 'chill', 'soft-pop'],
    'Cantankerous': ['punk', 'metal', 'hard-rock', 'grunge', 'alt-rock', 'blues'],
    'Capricious': ['indie', 'alternative', 'pop', 'electronic', 'world-music', 'folk'],
    'Cheerful': ['pop', 'indie-pop', 'dance', 'happy', 'folk', 'singer-songwriter'],
    'Chuffed': ['pop', 'happy', 'dance', 'indie-pop', 'folk', 'rock'],
    'Colorless': ['ambient', 'minimal', 'electronic', 'instrumental', 'downtempo', 'chillout'],
    'Covetous': ['r-n-b', 'soul', 'pop', 'hip-hop', 'jazz', 'blues'],
    'Crabby': ['rock', 'blues', 'alt-rock', 'punk', 'metal', 'grunge'],
    'Cranky': ['punk', 'rock', 'metal', 'hard-rock', 'alt-rock', 'blues'],
    'Craving': ['r-n-b', 'soul', 'pop', 'hip-hop', 'electronic', 'dance'],
    'Cross': ['rock', 'punk', 'metal', 'hard-rock', 'grunge', 'alt-rock'],
    'Deflated': ['ambient', 'acoustic', 'singer-songwriter', 'blues', 'indie', 'classical'],
    'Dejected': ['blues', 'sad', 'singer-songwriter', 'acoustic', 'folk', 'ambient'],
    'Depressed': ['sad', 'blues', 'ambient', 'acoustic', 'indie', 'singer-songwriter'],
    'Destitute': ['blues', 'folk', 'acoustic', 'singer-songwriter', 'ambient', 'sad'],
    'Devoid': ['ambient', 'minimal', 'electronic', 'instrumental', 'downtempo', 'chillout'],
    'Devouring': ['electronic', 'edm', 'hardcore', 'metal', 'punk', 'hard-rock'],
    'Disheartening': ['sad', 'ambient', 'classical', 'acoustic', 'indie', 'singer-songwriter'],
    'Dispiriting': ['ambient', 'sad', 'acoustic', 'singer-songwriter', 'blues', 'classical'],
    'Distant': ['ambient', 'chillout', 'instrumental', 'electronic', 'acoustic', 'indie'],
    'Dither': ['electronic', 'indie', 'alt-rock', 'punk', 'experimental', 'ambient'],
    'Drained': ['ambient', 'acoustic', 'singer-songwriter', 'sad', 'chillout', 'blues'],
    'Dyspeptic': ['rock', 'punk', 'metal', 'hard-rock', 'grunge', 'blues'],
    'Amusement': ['pop', 'comedy', 'indie-pop', 'happy', 'folk', 'electro'],
    'Euphoric': ['edm', 'trance', 'house', 'electro', 'dance', 'happy'],
    'Excited': ['pop', 'dance', 'edm', 'electro', 'rock', 'hip-hop'],
    'Exhausted': ['ambient', 'chill', 'acoustic', 'soft-rock', 'new-age', 'classical'],
    'Famished': ['blues', 'folk', 'country', 'rock', 'pop', 'soul'],
    'Fearful': ['soundtracks', 'ambient', 'classical', 'electronic', 'industrial', 'dark-ambient'],
    'Fiery': ['rock', 'metal', 'punk', 'hard-rock', 'alt-rock', 'hardcore'],
    'Gloomy': ['blues', 'sad', 'ambient', 'indie', 'acoustic', 'classical'],
    'Gorged': ['jazz', 'lounge', 'easy-listening', 'chill', 'soft-rock', 'ambient'],
    'Gormandizing': ['world-music', 'folk', 'jazz', 'soul', 'blues', 'easy-listening'],
    'Gratitude': ['gospel', 'soul', 'pop', 'acoustic', 'singer-songwriter', 'folk'],
    'Grim': ['metal', 'dark-ambient', 'industrial', 'blues', 'hardcore', 'grunge'],
    'Grumpy': ['rock', 'blues', 'alt-rock', 'punk', 'metal', 'hard-rock'],
    'Hesitant': ['ambient', 'indie', 'acoustic', 'classical', 'soft-pop', 'folk'],
    'Hollow': ['ambient', 'sad', 'electronic', 'indie', 'post-rock', 'acoustic'],
    'Hope': ['pop', 'indie-pop', 'acoustic', 'gospel', 'folk', 'singer-songwriter'],
    'Hopeless': ['sad', 'blues', 'ambient', 'acoustic', 'indie', 'classical'],
    'Humorous': ['comedy', 'pop', 'folk', 'indie', 'novelty', 'spoken-word'],
    'Idyllic': ['ambient', 'new-age', 'classical', 'acoustic', 'chill', 'folk'],
    'Inconsolable': ['sad', 'ambient', 'piano', 'classical', 'acoustic', 'blues'],
    'Insatiable': ['electro', 'pop', 'rock', 'dance', 'hip-hop', 'r-n-b'],
    'Inspiration': ['classical', 'pop', 'indie', 'gospel', 'folk', 'acoustic'],
    'Interest': ['indie', 'pop', 'rock', 'jazz', 'electronic', 'folk'],
    'Irascible': ['punk', 'metal', 'hard-rock', 'grunge', 'rock', 'alt-rock'],
    'Jittery': ['electronic', 'drum-and-bass', 'dubstep', 'punk', 'indie', 'alt-rock'],
    'Jumpy': ['electro', 'pop', 'rock', 'indie', 'dance', 'punk'],
    'Lamentable': ['sad', 'classical', 'blues', 'ambient', 'acoustic', 'folk'],
    'Lighthearted': ['pop', 'indie-pop', 'happy', 'folk', 'acoustic', 'electro'],
    'Livid': ['metal', 'punk', 'hard-rock', 'grunge', 'hardcore', 'alt-rock'],
    'Lonely': ['sad', 'ambient', 'acoustic', 'singer-songwriter', 'indie', 'blues'],
    'Love': ['romance', 'pop', 'r-n-b', 'soul', 'singer-songwriter', 'acoustic'],
  };

  return moodGenresMap[mood] || ['romance', 'pop', 'r-n-b', 'soul', 'singer-songwriter', 'acoustic']; // 如果找不到对应情绪，返回空数组
}

app.post('/create-playlist', async (req, res) => {
  const { tracksInfo, playlistName } = req.body; // 从请求体获取歌曲信息和播放列表名称
  spotifyApi.setAccessToken(access_token);
  console.log(tracksInfo);
  console.log(playlistName);
  console.log(access_token);
  try {
    // 创建一个空的播放列表
    const playlist = await spotifyApi.createPlaylist(playlistName, {
      description: 'Recommendations From Soul Sound',
      public: true // 或根据需要将其设置为false
    });

    // 搜索每首歌曲并获取其Spotify ID
    // 假设tracksInfo是一个包含歌曲名和歌手的数组，格式为["歌曲名 - 歌手名"]
    const trackIds = await Promise.all(tracksInfo.map(async (trackInfo) => {
      // 使用 "track:歌曲名 artist:歌手名" 格式来提高搜索准确性
      const query = `track:${trackInfo.split(' | ')[0]} artist:${trackInfo.split(' | ')[1]}`;
      console.log(query);
      const result = await spotifyApi.searchTracks(query);
      console.log("result")
      console.log(result)
      return result.body.tracks.items.length > 0 ? `spotify:track:${result.body.tracks.items[0].id}` : null;
    }));

    // 过滤掉未找到的歌曲
    const filteredTrackIds = trackIds.filter(id => id !== null);

    // 将歌曲添加到播放列表
    await spotifyApi.addTracksToPlaylist(playlist.body.id, filteredTrackIds);

    res.json({
      message: '播放列表创建成功',
      playlistId: playlist.body.id,
      playlistUrl: playlist.body.external_urls.spotify,
      playlistUri: playlist.body.uri
    });
  } catch (error) {
    console.error('创建播放列表时发生错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});
