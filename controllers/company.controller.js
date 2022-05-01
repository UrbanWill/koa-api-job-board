module.exports = {
  /**
   *
   * @api {post} /companies Create a new company
   * @apiGroup Companies
   * @apiName CreateCompany
   * @apiSuccess {Object} Company  A newly created Company Object
   * @apiExample {curl} Example usage:
   * curl -i http://localhost:4000/companies
   * @apiDescription LoggedIn user can register new Company
   * @apiHeader {String} Authorization  JWT Authorization header
   * @apiHeaderExample {json} Request Authorization Header
   * {
   *  "authorization" : "jkahdkjashdk324324342"
   * }
   * @apiParam {String} [name]
   * @apiParam {String} [city]
   * @apiParam {String} [address]
   * @apiParam {Number} [UserId]
   */
  async create(ctx) {
    try {
      ctx.body = await ctx.db.Company.create({
        ...ctx.request.body,
        UserId: ctx.state.user,
      });
    } catch (err) {
      ctx.throw(500, err);
    }
  },

  /**
   * @api {get} /companies Get all companies
   * @apiGroup Companies
   * @apiName GetCompanies
   * @apiSuccess {Object[]} Company List of Companies with Jobs
   * @apiExample {curl} Example usage:
   * curl -i http://localhost:4000/companies
   * @apiDescription LoggedIn user can view all the companies
   * @apiHeader {String} Authorization  JWT Authorization header
   * @apiHeaderExample {json} Request Authorization Header
   * {
   *  "authorization" : "jkahdkjashdk324324342"
   * }
   */

  async find(ctx) {
    try {
      ctx.body = await ctx.db.Company.findAll({
        UserId: ctx.state.user,
        include: [{ model: ctx.db.Job }],
      });
    } catch (err) {
      ctx.throw(404, err);
    }
  },

  /**
   *
   * @api {get} /companies/:id Get a company by id
   * @apiGroup Companies
   * @apiName GetCompany
   * @apiSuccess {Object} Company A single Company by Id
   * @apiExample {curl} Example usage:
   * curl -i http://localhost:4000/companies/:id
   * @apiDescription LoggedIn user can get single company by id
   * @apiHeader {String} Authorization  JWT Authorization header
   * @apiHeaderExample {json} Request Authorization Header
   * {
   *  "authorization" : "jkahdkjashdk324324342"
   * }
   */

  async findOne(ctx) {
    try {
      const company = await ctx.db.Company.findOne({
        where: { id: ctx.params.id },
      });

      if (!company) {
        ctx.throw(404, "Company not found");
      }

      ctx.body = company;
    } catch (err) {
      ctx.throw(404, err);
    }
  },

  /**
   *
   * @api {delete} /companies/:id Delete a company by id
   * @apiGroup Companies
   * @apiName deleteCompany
   * @apiSuccess {Object} Company is deleted successfully
   * @apiExample {curl} Example usage:
   * curl -i http://localhost:4000/companies/:id
   * @apiDescription LoggedIn user can delete the company by id
   * @apiHeader {String} Authorization  JWT Authorization header
   * @apiHeaderExample {json} Request Authorization Header
   * {
   *  "authorization" : "jkahdkjashdk324324342"
   * }
   */
  async destroy(ctx) {
    try {
      const result = await ctx.db.Company.destroy({
        where: { id: ctx.params.id },
      });
      if (result === 0) {
        ctx.throw(404, "Company not found");
      }
      ctx.body = `Deleted company with id ${ctx.params.id}`;
    } catch (err) {
      ctx.throw(404, err);
    }
  },

  async update(ctx) {
    try {
      const result = await ctx.db.Company.update(
        {
          name: ctx.request.body.name,
          address: ctx.request.body.address,
          city: ctx.request.body.city,
        },
        {
          where: { id: ctx.params.id },
        }
      );
      if (result === 0) {
        ctx.throw(404, "Company not found");
      }
      ctx.body = `Updated company with id ${ctx.params.id}`;
    } catch (err) {
      ctx.throw(404, err);
    }
  },
};
