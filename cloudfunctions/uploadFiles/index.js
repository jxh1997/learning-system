const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud1-7gexle7210ddbd11'
})

const db = cloud.database()
const _ = db.command


exports.main = async (event, context) => {
  console.log(event);
  try {
    if(event.type === 'Teaching') {
      return await db.collection('resources').doc(event.courseId)
      .update({
        data: {
          teachingMaterials: event.materials,
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
    } else if(event.type === 'Reference') {
      return await db.collection('resources').doc(event.courseId)
      .update({
        data: {
          referenceMaterials: event.materials,
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
    } else if(event.type === 'Video') {
      return await db.collection('resources').doc(event.courseId)
      .update({
        data: {
          videoMaterials: event.materials,
        },
      })
      .then(res => {
        console.log("视频上传成功", res);
        return res
      })
      .catch(err => {
        console.log("视频上传失败", err);
        return err
      })
    }
  } catch (e) {
    console.error(e)
  }
}