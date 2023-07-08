import { decodeBase64ToImage } from "../../helper/imageHandlers.js";
import Articles from "../../models/admin/articles.js";
import fs from "fs";

export const createArticle = async (req, res) => {
  const { title, description, image } = req.body;

  try {
    if (req.user.role === "admin") {
      if (image?.length > 0 && description?.length > 0 && title?.length > 0) {
        try {
          const imageToUpload =
            Math.round(Math.random() * 10000).toString() +
            "_" +
            Date.now() +
            ".jpg";

          let dir = "files/";

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }

          dir = "files/images/";

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }

          dir = "files/images/articles/";

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }

          const imagePath = dir + imageToUpload;

          const imageData = decodeBase64ToImage(image);

          if (imageData.data) {
            fs.writeFile(
              imagePath,
              imageData.data,
              { encoding: "base64" },
              (error) => {
                if (error) {
                  res.status(404).send({
                    message: `Error in uploading image: ${error.message}`,
                  });
                  return;
                }
              }
            );
          } else {
            res.status(404).send({
              message: `Please upload a proper image like: '.jpg', '.png', '.jpeg'`,
            });
            return;
          }

          const createdArticle = await Articles.create({
            title,
            description,
            imagePath,
          });
          res.status(201).send(createdArticle);
        } catch (error) {
          res
            .status(404)
            .send({ message: `Error in uploading image: ${error.message}` });
        }
      } else {
        res.status(404).send({
          message: "Title, description and image require for creating article",
        });
      }
    } else {
      res.status(404).send({
        message: "Only admin has access to create article",
      });
    }
  } catch (error) {
    res.status(422).send({ message: error.message });
  }
};

export const getArticles = async (req, res) => {
  try {
    if (req?.query === "featured") {
      const fetchedArticle = await Articles.find({ featured: true });
      res.status(201).send(fetchedArticle);
    } else {
      const fetchedArticle = await Articles.find();
      res.status(201).send(fetchedArticle);
    }
  } catch (error) {
    res.status(422).send({ message: error.message });
  }
};

export const editArticle = async (req, res) => {
  if (req.user.role === "admin") {
    try {
      if (!req.body._id) {
        return res.status(404).send({ message: "Please provide a valid id." });
      }

      const imageToUpload =
        Math.round(Math.random() * 10000).toString() +
        "_" +
        Date.now() +
        ".jpg";

      const dir = "files/images/articles/";

      const imagePath = dir + imageToUpload;

      const imageData = decodeBase64ToImage(req.body.image);

      if (imageData.data) {
        fs.writeFile(
          imagePath,
          imageData.data,
          { encoding: "base64" },
          (error) => {
            if (error) {
              res.status(404).send({
                message: `Error in uploading image: ${error.message}`,
              });
              return;
            }
          }
        );

        const existindData = await Articles.findById(req.body._id);

        const data = {
          title: req.body.title,
          description: req.body.description,
          imagePath,
        };

        const updatedArticle = await Articles.findByIdAndUpdate(
          req.body._id,
          data,
          {
            new: true,
          }
        );

        fs.unlink(existindData.imagePath, function (err) {
          if (err) return res.status(404).send(err);
        });

        res.status(202).send(updatedArticle);
      } else {
        res.status(404).send({
          message: `Please upload a proper image like: '.jpg', '.png', '.jpeg'`,
        });
        return;
      }
    } catch (error) {
      res.status(422).send({ message: `Main error ${error.message}` });
    }
  } else {
    res.status(404).send({
      message: "Only admin has access to create article",
    });
  }
};

export const handleFeaturedArticle = async (req, res) => {
  if (req.user.role === "admin") {
    try {
      const updatedArticle = await Articles.findByIdAndUpdate(
        req.body._id,
        { featured: req.body?.featured },
        { new: true }
      );

      res.status(201).send(updatedArticle);
    } catch (error) {
      res.status(422).send({ message: `Main error ${error.message}` });
    }
  } else {
    res.status(404).send({
      message: "Only admin has access to create article",
    });
  }
};

export const removeArticle = async (req, res) => {
  if (req.user.role === "admin") {
    try {
      const deletedArticle = await Articles.findByIdAndRemove(req.body._id, {
        new: true,
      });

      res.status(201).send(deletedArticle);
    } catch (error) {
      res.status(422).send({ message: `Main error ${error.message}` });
    }
  } else {
    res.status(404).send({
      message: "Only admin has access to create article",
    });
  }
};
