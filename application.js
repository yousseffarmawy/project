const mongoose = require("mongoose");
// دي منونجو ليبيري زي بتاعت اكسبرس كدا
const application =new mongoose.schema(
    {
    job: {
      // ده حقل في النموذج بتاعنا
type:mongoose.schema.Types.ObjectId,
// ده نوع البيانات اللي هيبقى عندنا في قاعدة البيانات
ref:"Job",

required:true,
//يعني لازم الوظيفة تكون محددة عند إنشاء التقديم (مش ممكن يبقى فاضي).
    },
    user: {
      // ] دا راجل اللي هيعمل التقديم ع شغل 
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
      required: true,

    },
cv : {
  type  : String,
  required: true,

  },})
