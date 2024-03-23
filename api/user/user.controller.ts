import { Request, Response } from "express";
import { User } from "../../model/User";
import {
  AVATAR_DEFAULT,
  BAD_PASSWORD,
  NOT_FOUND,
  SECRET,
  UNDEFINED,
} from "../constant";
import {
  RESPONSE_FALSE_BAD_PASSWORD,
  RESPONSE_FALSE_DUPLICATE_USER,
  RESPONSE_FALSE_INTERNAL_SERVER_ERROR,
  RESPONSE_FALSE_TOKEN,
  RESPONSE_FALSE_USER_NOT_FOUND,
  RESPONSE_TRUE
} from "../constant.response";
import { removeAvatarFirebase, uploadPictureFirebase } from "../firebase";
import { generateToken, verifyToken } from "../jwtToken";
import {
  authentication,
  getAllUser,
  getUserByUid,
  getUserByUsername,
  insert,
  update
} from "./user.model";

export const findAllUsers = (req: Request, res: Response) => {
  getAllUser((err: any, result: any) => {
    if (err) {
      res.json(RESPONSE_FALSE_INTERNAL_SERVER_ERROR);
    } else {
      res.json({ ...RESPONSE_TRUE, user: result });
    }
  });
};

export const findByUserId = (req: Request, res: Response) => {
  const uid = req.params.uid;

  getUserByUid(+uid, (err: any, result: any) => {
    if (err) {
      res.json(RESPONSE_FALSE_INTERNAL_SERVER_ERROR);
    } else {
      res.json({
        ...RESPONSE_TRUE,
        user: {
          uid: result.uid,
          name: result.name,
          username: result.username,
          avatar: result.avatar,
        },
      });
    }
  });
};

export const findByUsername = (req: Request, res: Response) => {
  const username = req.params.username;

  getUserByUsername(username, (err: any, result: any) => {
    if (err) {
      res.json(RESPONSE_FALSE_INTERNAL_SERVER_ERROR);
    } else {
      res.json({
        ...RESPONSE_TRUE,
        user: result[0],
      });
    }
  });
};

export const createUser = (req: Request, res: Response) => {
  let downloadUrl;
  const user: User = req.body;

  const username = user.username;
  const filePic = req.file;

  console.log("username" + username);

  getUserByUsername(username, async (err: any, result: any) => {
    // check username is duplicate
    if (result.length == 1) {
      res.json(RESPONSE_FALSE_DUPLICATE_USER);
    } else {
      // check avatar is null
      if (filePic?.originalname == UNDEFINED) {
        // set image defaul
        downloadUrl = AVATAR_DEFAULT;
      } else {
        downloadUrl = await uploadPictureFirebase(req);
      }

      insert(user, downloadUrl, (err: any, result: any) => {
        res.json({
          ...RESPONSE_TRUE,
          affected_row: result.affectedRows,
          last_idx: result.insertId,
        });
      });
    }
  });
};

export const login = (req: Request, res: Response) => {
  let user: User = req.body;

  // parameter
  const username = user.username;
  const password = user.password;

  authentication(username, password, (err: any, result: any) => {
    if (result == NOT_FOUND) {
      res.json(RESPONSE_FALSE_USER_NOT_FOUND);
    } else if (result == BAD_PASSWORD) {
      res.json(RESPONSE_FALSE_BAD_PASSWORD);
    } else {
      const payload = { username: result.username, password: result.password };
      const user = {
        uid: result.uid,
        name: result.name,
        username: result.username,
        avatar: result.avatar,
        role: result.role,
      };
      const token_jwt = generateToken(payload, SECRET);
      res.status(200).json({ ...RESPONSE_TRUE, token: token_jwt, user: user });
    }
  });
};

export const findUserByToken = (req: Request, res: Response) => {
  const token = req.body.token;
  const data = verifyToken(token, SECRET);

  if (data.valid) {
    getUserByUsername(data.decoded.username, (err: any, result: any) => {
      res.json({ ...RESPONSE_TRUE, user: result[0] });
    });
  } else {
    res.json({ ...RESPONSE_FALSE_TOKEN });
  }
};

export const editUser = async (req: Request, res: Response) => {
  const uid = req.params.uid;
  const name = req.body.name;
  const username = req.body.username;
  const pwd = req.body.password ?? '';
  const new_pwd = (req.body.newPassword === "" || req.body.newPassword === null) ? pwd: req.body.newPassword;
  console.log(new_pwd);
  
  let downloadUrl = '';

  getUserByUid(+uid, (err: any, result: any) => {
    authentication(result.username, pwd, async (err: any, result: any) => {
      if (result == NOT_FOUND) {
        res.json(RESPONSE_FALSE_USER_NOT_FOUND);
      } else if (result == BAD_PASSWORD) {
        res.json(RESPONSE_FALSE_BAD_PASSWORD);
      } else {
        if (typeof (req.body.avatar) != 'string') {
          downloadUrl = await uploadPictureFirebase(req);
          removeAvatarFirebase(+uid);
        } else {
          downloadUrl = req.body.avatar;
        }
        const payload = { username: username, password: new_pwd};
        const token_jwt = generateToken(payload, SECRET);
        
        update(+uid, name, username, downloadUrl, new_pwd, (err: any, result: any) => {
          if (err) {
            res.json({ ...RESPONSE_FALSE_DUPLICATE_USER});
          }
          else {
            res.json({...RESPONSE_TRUE,token:token_jwt})
          }
        });
      }
    })
  })


  // Update Name, Username and Picture
  // update(+uid, name, username, downloadUrl, new_pwd, (err: any, result: any) => {

  //   if (err) {
  //     console.log(err);
  //     res.json({ ...RESPONSE_FALSE });
  //   }
  //   else {

      //   // Check Lenght Password And New Password for Change
      //   if (pwd.length != 0 && new_pwd.length != 0) {
      //     // Compare username and Password
      //     authentication(username, pwd, (err: any, result: any) => {
      //       if (err) {
      //         res.json({ ...RESPONSE_FALSE, err });
      //       } else {
      //         // Password Incorrect
      //         if (result == BAD_PASSWORD) {
      //           res.json({
      //             ...RESPONSE_FALSE_BAD_PASSWORD,
      //             detail: "name and username success",
      //           });
      //         }
      //         // Password Correct Change new Password
      //         else {
      //           updatePassword(new_pwd, +uid, (err: any, result: any) => {
      //             if (err) {
      //               res.json({ ...RESPONSE_FALSE });
      //             } else {
      //               res.json({
      //                 ...RESPONSE_TRUE,
      //                 detail: "name, username, picture and password success",
      //               });
      //             }
      //           });
      //         }
      //       }
      //     });
      //   } else {
      //     res.json({
      //       ...RESPONSE_TRUE,
      //       detail: "name, username and picture success",
      //     });
      //   }
  //   }
  // });
};
