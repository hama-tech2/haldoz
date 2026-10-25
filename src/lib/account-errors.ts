export const authErrors: Record<string, string> = {
  callback: "چوونەژوورەوە تەواو نەبوو. تکایە لە هەمان وێبگەڕەوە دووبارە هەوڵ بدەوە.",
  callback_missing_code: "وەڵامی چوونەژوورەوە تەواو نییە. لە دوگمەی Google ـەوە دەست پێ بکەرەوە.",
  callback_denied: "ڕێگەپێدانی Google تەواو نەکرا. ئەگەر دەتەوێت، دووبارە هەوڵ بدەوە.",
  callback_verifier_missing: "چوونەژوورەوە لەم وێبگەڕەدا دەست پێ نەکراوە یان بەسەرچووە. لە هەمان وێبگەڕ و هەمان ناونیشانەوە دەست پێ بکەرەوە.",
  callback_exchange_failed: "پشتڕاستکردنەوەی Google تەواو نەبوو. هیچ پەڕەیەک دروست نەکرا. تکایە دووبارە هەوڵ بدەوە.",
  callback_identity_failed: "دانیشتنی چوونەژوورەوە پشتڕاست نەکرایەوە. تکایە دووبارە بچۆ ژوورەوە.",
  callback_configuration: "خزمەتگوزاریی چوونەژوورەوە هێشتا بە تەواوی ئامادە نییە.",
  callback_origin: "تکایە چوونەژوورەوە لە ناونیشانی سەرەکیی هەڵدۆزەوە دەست پێ بکەرەوە.",
  session_missing: "چوونەژوورەوەکەت پشتڕاست نەکرایەوە یان بەسەرچووە. تکایە بە Google بچۆ ژوورەوە.",
};
export function authErrorMessage(code?: string) {
  return code && Object.hasOwn(authErrors, code) ? authErrors[code] : authErrors.callback;
}
export const pageDatabasePending = "چوویتە ژوورەوە. خزمەتگوزاریی پاشەکەوتکردنی پەڕە هێشتا ئامادە نییە؛ تا چالاککردنی، پەڕەکەت پاشەکەوت ناکرێت. پێویست ناکات دووبارە بە Google بچیتە ژوورەوە.";
export const pageDatabaseUnavailable = "چوویتە ژوورەوە، بەڵام زانیاریی پەڕەکەت ئێستا بەردەست نییە. هیچ گۆڕانکارییەک پاشەکەوت نەکراوە؛ تکایە دواتر دووبارە پشکنین بکە.";
