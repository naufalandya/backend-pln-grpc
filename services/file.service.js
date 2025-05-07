const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient()
module.exports = {
  UploadFile: async (call, callback) => {
    const { file_id, revoke, modify } = call.request;
  
    console.log(call.request)
    try {
      if (revoke.length > 0) {
        for (const r of revoke) {
          const targetExists = await db.file.findUnique({
            where: { id: r.target_file_id }
          });
  
          if (!targetExists) continue;
  
          const exist = await db.relation.findFirst({
            where: {
              impacter_file_id: file_id,
              impacted_file_id: r.target_file_id,
              type : 'REVOKE'
            }
          });
  
          if (!exist && file_id !== r.target_file_id) {
            await db.relation.create({
              data: {
                impacter_file_id: file_id,
                impacted_file_id: r.target_file_id,
                type: 'REVOKE',
                reason: r.reason
              }
            });
          }
        }
      }
  
      if (modify.length > 0) {
        for (const r of modify) {
          const targetExists = await db.file.findUnique({
            where: { id: r.target_file_id }
          });
  
          if (!targetExists) continue;
  
          const exist = await db.relation.findFirst({
            where: {
              impacter_file_id: file_id,
              impacted_file_id: r.target_file_id,
              type : 'MODIFY'
            }
          });
  
          if (!exist && file_id !== r.target_file_id) {
            await db.relation.create({
              data: {
                impacter_file_id: file_id,
                impacted_file_id: r.target_file_id,
                type: 'MODIFY',
                reason: r.reason
              }
            });
          }
        }
      }
  
      if (file_id) {
        callback(null, {
          status: true,
          message: `File ${file_id} uploaded with ${revoke.length} revoke and ${modify.length} modify relations.`,
        });
      } else {
        callback(null, {
          status: false,
          message: 'File ID is missing or invalid.',
        });
      }
  
    } catch (error) {
      console.error('UploadFile Error:', error);
      callback(null, {
        status: false,
        message: 'An error occurred during file upload.',
      });
    }
  }
  
};
