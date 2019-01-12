const Client = require('instagram-private-api').V1;

const delay = require('delay');

const chalk = require('chalk');

const _ = require('lodash');

const rp = require('request-promise');

const S = require('string');

const inquirer = require('inquirer');

var fs = require('fs'),

    request = require('request');

const User = [

{

  type:'input',

  name:'username',

  message:'[>] Insert Username:',

  validate: function(value){

    if(!value) return 'Can\'t Empty';

    return true;

  }

},

{

  type:'password',

  name:'password',

  message:'[>] Insert Password:',

  mask:'*',

  validate: function(value){

    if(!value) return 'Can\'t Empty';

    return true;

  }

},

{

  type:'input',

  name:'txt',

  message:'[>] Insert txt:',

  validate: function(value){

    if(!value) return 'Can\'t Empty';

    return true;

  }

},

{

  type:'input',

  name: 'logDM',

  message:'[>] Insert Log:',

  validate: function(value){

    if(!value) return 'Can\'t Empty';

    return true;

  }

},

{

  type:'input',

  name:'mysyntx',

  message:'[>] Input Total of Target You Want (ITTYW):',

  validate: function(value){

    value = value.match(/[0-9]/);

    if (value) return true;

    return 'Use Number Only!';

  }

},

{

  type:'input',

  name:'sleep',

  message:'[>] Insert Sleep (MiliSeconds):',

  validate: function(value){

    value = value.match(/[0-9]/);

    if (value) return true;

    return 'Delay is number';

  }

}

]

const Login = async function(User){

  const Device = new Client.Device(User.username);

  const Storage = new Client.CookieMemoryStorage();

  const session = new Client.Session(Device, Storage);

  try {

    await Client.Session.create(Device, Storage, User.username, User.password)

    const account = await session.getAccount();

    return Promise.resolve({session,account});

  } catch (err) {

    return Promise.reject(err);

  }

}

const Target = async function(username){

  const url = 'https://www.instagram.com/'+username+'/'

  const option = {

    url: url,

    method: 'GET'

  }

  try{

    const account = await rp(option);

    const data = S(account).between('<script type="text/javascript">window._sharedData = ', ';</script>').s

    const json = JSON.parse(data);

    if (json.entry_data.ProfilePage[0].graphql.user.is_private) {

      return Promise.reject('PERINGATAN! AKUN KAMU JANGAN DI PRIVATE BOS KU');

    } else {

      const id = json.entry_data.ProfilePage[0].graphql.user.id;

      const followers = json.entry_data.ProfilePage[0].graphql.user.edge_followed_by.count;

      return Promise.resolve({id,followers});

    }

  } catch (err){

    return Promise.reject(err);

  }

}

const CommentLikeDM = async function(session, accountId, text){

  var result;

  const feed = new Client.Feed.UserMedia(session, accountId);

  try {

    result = await feed.get();

  } catch (err) {

    return chalk`{bold.red ${err}}`;

  }

  if (result.length > 0) {

    const task = [

    //ngefollow(session, accountId),

    //ngeComment(session, result[0].params.id, text),

	ngeDM(session, accountId, text),    ngeLike(session, result[0].params.id)

    ]

    const [Like,DM] = await Promise.all(task);

    //const printFollow = Follow ? chalk`{green Follow}` : chalk`{red Follow}`;

    //const printComment = Comment ? chalk`{green Comment}` : chalk`{red Comment}`;

	const printDM = DM ? chalk`{green DM}` : chalk`{red DM}`;

    const printLike = Like ? chalk`{green Like}` : chalk`{red Like}`;

    return chalk`{bold.green ${printDM},${printLike} [${text}]}`;

  }

  return chalk`{bold.white Timeline Kosong (SKIPPED)}`

};

async function ngeLike(session, id){

  try{

    await Client.Like.create(session, id)

    return true;

  } catch(e) {

    return false;

  }

}

async function ngeDM(session, users, text){

		try{

    await Client.Thread.configureText(session, users, text)

        return true;

  } catch(e) {

        return false;

  }

}

const Followers = async function(session, id){

  const feed = new Client.Feed.AccountFollowers(session, id);

  try{

    const Pollowers = [];

    var cursor;

    do {

      if (cursor) feed.setCursor(cursor);

      const getPollowers = await feed.get();

      await Promise.all(getPollowers.map(async(akun) => {

        Pollowers.push(akun.id);

      }))

      cursor = await feed.getCursor();

    } while(feed.isMoreAvailable());

    return Promise.resolve(Pollowers);

  } catch(err){

    return Promise.reject(err);

  }

}

const Excute = async function(User, TargetUsername, txt, logDM, Sleep, mysyntx){

  try {

    console.log(chalk`{yellow \n [?] Try to Login . . .}`)

    const doLogin = await Login(User);

    console.log(chalk`{green  [!] Login Succsess, }{yellow [?] Try To Get ID & Followers Target . . .}`)

    const getTarget = await Target(TargetUsername);

    console.log(chalk`{green  [!] ${TargetUsername}: [${getTarget.id}] | Followers: [${getTarget.followers}]}`)

    const getFollowers = await Followers(doLogin.session, doLogin.account.id)

    console.log(chalk`{cyan  [?] Try to Follow, Comment, DM, and Like Followers Target . . . \n}`)

    const Targetfeed = new Client.Feed.AccountFollowers(doLogin.session, getTarget.id);

    var TargetCursor;

    do {

      if (TargetCursor) Targetfeed.setCursor(TargetCursor);

      var TargetResult = await Targetfeed.get();

      TargetResult = _.chunk(TargetResult, mysyntx);

      for (let i = 0; i < TargetResult.length; i++) {

        var timeNow = new Date();

        timeNow = `${timeNow.getHours()}:${timeNow.getMinutes()}:${timeNow.getSeconds()}`

        await Promise.all(TargetResult[i].map(async(akun) => {

          if (!getFollowers.includes(akun.id) || akun.params.isPrivate === false) {

			var Text = fs.readFileSync(txt+'.txt', 'utf8').split('|');

            var ranText = Text[Math.floor(Math.random() * Text.length)];

            var lastid1 = fs.appendFileSync(logDM+'.txt','\n','utf8');

            var Textlastid = fs.readFileSync(logDM+'.txt', 'utf8');

            var searchUser = Textlastid.search(akun.params.username);

            var lastid = fs.appendFileSync(logDM+'.txt',akun.params.username,'utf8');

            if (searchUser == -1) {

            const ngeDo = await CommentLikeDM(doLogin.session, akun.id, ranText)

            console.log(chalk`[Akun: ${User.username}] {bold.green [>]}${akun.params.username} => ${ngeDo}`)

            console.log(chalk`{yellow \n [#][>] Delay For ${Sleep} MiliSeconds [<][#] \n}`);

            await delay(Sleep);

          } else {

            console.log(chalk`[Akun: ${User.username}] {bold.yellow [SKIP]}${akun.params.username} => Sudah Di DM Bro...`)

          }

        }else{"hoho"}}));

      }

      TargetCursor = await Targetfeed.getCursor();

      console.log(chalk`{yellow \n [#][>] Delay For ${Sleep} MiliSeconds [<][#] \n}`);

      await delay(Sleep);

    } while(Targetfeed.isMoreAvailable());

  } catch (err) {

    console.log(err);

  }

}

console.log(chalk`

  {bold.cyan

  —————————————————— [INFORMATION] ————————————————————

  [?] {bold.green FFTauto | Using Account/User Target!}

  [?] {bold.green Follow, Comment, DM & Like}

  [?] {bold.green Gunakan komen.txt untk komen!}

  ——————————————————  [THANKS TO]  ————————————————————

  [✓] CODE BY CYBER SCREAMER CCOCOT (ccocot@bc0de.net)

  [✓] FIXING & TESTING BY SYNTAX (@officialputu_id)

  [✓] CCOCOT.CO | BC0DE.NET | NAONLAH.NET | WingkoColi

  [✓] SGB TEAM REBORN | Zerobyte.id | ccocot@bc0de.net

  —————————————————————————————————————————————————————

  What's new?

  1. Input Target/delay Manual (ITTYW)

  —————————————————————————————————————————————————————}

      `);

//ikiganteng

inquirer.prompt(User)

.then(answers => {

  Excute({

    username:answers.username,

    password:answers.password

  },answers.username,answers.txt,answers.logDM,answers.sleep,answers.mysyntx);

})
