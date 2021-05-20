const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-7gexle7210ddbd11'
})

const db = cloud.database()
const _ = db.command


exports.main = async (event, context) => {
  console.log(event);
  try {
    return await db.collection('worksFinish').doc(event.id)
      .update({
        data: {
          status: event.status,
        },
      })
      .then(res => {
        console.log("更新上传成功", res);
        return res
      })
      .catch(err => {
        console.log("更新上传失败", err);
        return err
      })
  } catch (e) {
    console.error(e)
  }
}