import * as toxicity from "@tensorflow-models/toxicity";

export const checkToxic = (req, res, next) => {
  const { title, summary, content } = req.body;
  const checkText = `${title} ${summary} ${content}`;
  const threshold = 0.9;
  const labelsToInclude = [
    "identity_attack",
    "insult",
    "threat",
    "toxicity",
    "obscene",
    "severe_toxicity",
    "sexual_explicit",
  ];
  toxicity.load(threshold, labelsToInclude).then((model) => {
    model.classify(checkText).then((predictions) => {
      const isToxic = predictions.some((e) => e.results[0].match);
    //   console.log(predictions);
    //   console.log(isToxic);
      if (isToxic) {
        return res.json({
          message: "Post contains toxic content. Try again.",
          type: "error",
        });
      } else {
        next();
      }
    });
  });
};
