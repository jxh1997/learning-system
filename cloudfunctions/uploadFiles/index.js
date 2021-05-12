const cloud = require('wx-server-sdk')

cloud.init({
  env: 'lms-3gkwj950d4e06374'
})

const db = cloud.database()
const _ = db.command


exports.main = async (event, context) => {
  console.log(event);
  try {
    return await db.collection('resources').doc(event.courseId)
      .update({
        data: {
          teachingMaterials: event.teachingMaterials,
        },
      })
      .then(res => {
        console.log("资料上传成功", res);
        return res
      })
      .catch(err => {
        console.log("资料上传失败", err);
        return err
      })

  } catch (e) {
    console.error(e)
  }
}