const express = require("express");
const router = express.Router();
const db = require("../models");
const UserBet = db.User_Bet;
const Bet = db.Bet;



// get all unread notifications
// router.get("/", (req, res) => {
//   if (req.session.user) {
//     UserBet.findAll({
//       where: {
//         user_id: req.session.user.id
//       },
//       order: [
//         ['createdAt', 'ASC'],
//       ],
//     }).then((rez) => {
//       // console.log(rez.toJSON);
//       res.json(rez);
//     });
//   } else {
//     res.status(200);
//   }
// });

router.put("/:id/termStatus", (req, res) => {
  let betid;

  UserBet.update(
    {
      termStatus: req.body.termStatus,
      notificationType: req.body.termStatus ? 'teamSelect' : 'declined'
    },
    {
      where: { id: req.params.id },
      returning: true,
      plain: true,
    }
  )
    .then((thisUserBet) => {
      betid = thisUserBet[1].dataValues.bet_id;
      return UserBet.findAndCountAll({
        where: { bet_id: betid, termStatus: true }
      })
    })
    .then((result) => {
      Bet.findOne(
        {
          where: { id: betid },
          attributes: ['inviteCount', 'bet_status'],
        }
      ).then((countAndStatus) => {
        Bet.update(
          {
            participants: result.count,
            // use == because one of them is string and the other is integer
            bet_status: countAndStatus.dataValues.inviteCount == result.count ? 'active' : countAndStatus.dataValues.bet_status,
          },
          { where: { id: betid } }
        )
      })
    })
    .then(() => {
      res.status(200).json({ message: "modified" });
    });
});

router.put("/:id/teamSelect", (req, res) => {
  UserBet.update(
    {
      teamSelect: req.body.teamSelect,
      notificationType: 'inProgress'
    },
    { where: { id: req.params.id } }
  ).then(() => {
    res.status(200).json({ message: "modified" });
  });
});

router.put("/:id/notificationRead", (req, res) => {
  console.log('this shit broken');
  UserBet.update(
    {
      notificationRead: true
    },
    { where: { id: req.params.id } }
  ).then(() => {
    res.status(200).json({ message: 'modified' });
  });
});

module.exports = router;
