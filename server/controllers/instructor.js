import User from "../models/user";
import Stripe from "stripe";

// Dynamically import the query-string package
import queryString from "query-string";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

export const makeInstructor = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();

    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({
        type: "express",
      });
      user.stripe_account_id = account.id;
      user.save();
    }

    let account_link = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });
    account_link = Object.assign(account_link, {
      "stripe_user[email]": user.email || undefined,
    });

    return res.send(
      `${account_link.url}?${queryString.stringify(account_link)}`
    );
  } catch (err) {
    console.log("MAKE INSTRUCTOR ERR", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const currentInstructor = async (req, res) => {
    try {
        let user = await User.findById(req.user._id).select("-password").exec();
        if (!user.role.includes("Instructor")) {
            return res.sendStatus(403);
        }
        else {
            res.json({ ok: true });
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
}
