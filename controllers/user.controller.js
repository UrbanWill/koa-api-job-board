const UtilService = require("../services/util.service");
const JwtService = require("../services/jwt.service");

module.exports = {
  /**
   * @api {post} /signup Register a new user
   * @apiGroup Users
   * @apiName signupUser
   * @apiParam {String} [email] Mandatory User's email
   * @apiParam {String} [password] User's password
   * @apiParamExample {json} Request Params:
   *    {
   *     "email": "example@email.com",
   *     "password": "123"
   *    }
   * @apiSuccess {String} Msg Signup successful
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 OK
   *   {"msg": "Signup successful"}
   * @apiExample {curl} Example usage:
   * curl -i http://localhost:4000/signup
   * @apiDescription User can create a new account
   */
  async signup(ctx) {
    try {
      const { email, password } = ctx.request.body;
      if (!email) {
        ctx.throw(400, "Please provide an email");
      }
      if (!password) {
        ctx.throw(400, "Please provide a password");
      }

      const encryptedPassword = await UtilService.hashPassword(password);
      await ctx.db.User.create({ email, password: encryptedPassword });
      ctx.body = { message: "Signup successful" };
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * @api {post} /login Login user
   * @apiGroup Users
   * @apiName loginUser
   * @apiParam {String} [email] Mandatory User's email
   * @apiParam {String} [password] User's password
   * @apiParamExample {json} Request Params :
   * {
   *  "email"  : "test@email.com",
   *  "password" : "password12"
   * }
   * @apiSuccess {Object} Token  A Json web token to access protected routes
   * @apiSuccessExample {json} Login Response:
   * {
   *  "token" : "XZADJHASGDJHASGDJHAGSDJAGSJDH"
   * }
   * @apiExample {curl} Example usage:
   * curl -i http://localhost:4000/login
   * @apiDescription User can login to the system
   */

  async login(ctx) {
    try {
      const { email, password } = ctx.request.body;

      if (!email) {
        ctx.throw(400, "Please provide an email");
      }

      if (!password) {
        ctx.throw(400, "Please provide a password");
      }

      const user = await ctx.db.User.findOne({ where: { email } });

      if (!user) {
        ctx.throw(400, "User not found");
      }

      const isPasswordValid = await UtilService.comparePassword(
        password,
        user.password
      );

      if (isPasswordValid) {
        // generate a token
        const token = JwtService.issue(
          {
            payload: {
              user: user.id,
            },
          },
          "1 day"
        );

        ctx.body = { token };
      } else {
        ctx.throw(400, "Invalid password");
      }
    } catch (err) {
      ctx.throw(500, err);
    }
  },
};
