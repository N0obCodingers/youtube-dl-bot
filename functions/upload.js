const { Markup } = require('telegraf');
const fs = require('fs');
const clearCache = require('./clearCache');

module.exports = (ctx, info) => {
  console.log('Uploading...');
  ctx.deleteMessage(info.textLoad);
  ctx
    .replyWithMarkdown(
      `_⬆️ Sedang mengunggah..._\nProses ini mungkin sedikit lebih lama`
    )
    .then((m) => (info.textLoad = m.message_id));
  setTimeout(() => {
    ctx.deleteMessage(info.textLoad);
  }, 5000);

  console.log('message id dari pesan "sedang memproses":', info.textLoad);

  const extension = info.formatCode == '140' ? 'mp3' : 'mp4';

  const fileToUpload = `${info.display_id}-${info.formatCode}.${extension}`;
  console.log('Nama file output:', fileToUpload);
  console.log();
  fs.readdir('./', (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      console.log(file);
    });
  });
  console.log();
  const send =
    info.formatCode == '140' ? ctx.replyWithAudio : ctx.replyWithVideo;
  console.log(info.judul);
  send(
    {
      source: fileToUpload,
      filename: info.judul + `.${extension}`,
    },
    {
      ...Markup.inlineKeyboard([
        [
          Markup.button.url('💵 Donasi', 'https://donate.tfkhdyt.my.id/'),
          Markup.button.url(
            '💻 Source Code',
            'https://github.com/tfkhdyt/youtube-dl-bot/'
          ),
        ],
        [
          Markup.button.url(
            '💠 Project saya yang lainnya',
            'https://tfkhdyt.my.id/#portfolio'
          ),
        ],
      ]),
    }
  )
    .then((res) => {
      console.log('Upload:', res);
      const path = './' + fileToUpload;
      clearCache(path);
    })
    .catch((err) => {
      console.log('Error yang terjadi saat upload:', err);
    });
};
