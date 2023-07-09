'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: "https://i.etsystatic.com/10787697/r/il/2fdd34/3705714440/il_fullxfull.3705714440_oyaj.jpg",
        preview: true
      },
      {
        groupId: 2,
        url: "https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg",
        preview: true
      },
      {
        groupId: 3,
        url: "https://www.bhg.com/thmb/WJktvf63Wc9BKKDycxnA4utyJ1g=/1983x0/filters:no_upscale():strip_icc()/Knitting-101-c4dc7f4edd724662bf422c05f555f04a.jpg",
        preview: true
      },
      {
        groupId: 4,
        url: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3RvZ3JhcGh5fGVufDB8fDB8fHww&w=1000&q=80",
        preview: true
      },
      {
        groupId: 1,
        url: "https://blog.padi.com/wp-content/uploads/2013/03/padi-enriched-air-nitrox-diver-underwater-scaled.jpg",
        preview: false
      },
      {
        groupId: 2,
        url: "https://seeklogo.com/images/A/apex-logo-C3478A4601-seeklogo.com.png",
        preview: false
      },


    ], {});


  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3, 4, 5,6] }
    }, {});
  }
};
