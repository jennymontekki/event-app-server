'use strict';
const faker = require('faker');
const _ = require('lodash');

const eventForTests = {
  id: 61,
  title: 'test event 1',
  address: 'Ushakova Ave, 25, Kherson, Khersons\'ka oblast, Ukraine, 73009',
  location: JSON.stringify({ lat:46.635417, lng :32.616867 }),
  description: 'test event description',
  date: '2018-06-13 14:00:13.000 +00:00',
  categoryId: 6,
  userId: 41,
  createdAt: '2018-06-12 22:24:12.285 +00:00',
  updatedAt: '2018-06-12 22:24:12.285 +00:00'
};

const eventsNames = ['Datacloud Asia 2018',
  'Polymers: Design, Function and Application',
  '10th International Congress of Internal Medicine',
  'Artificial intelligence in imaging - threat or opportunity?',
  'Digital Automotive Manufacturing Conference',
  'International Battery Seminar & Exhibit',
  'Day of Science and Careers London',
  'Living in the Internet of Things and Cyber Security'
];

const descriptions = [
  'The Architectural and Environmental Design (AED) is created to be a platform for all early career researchers, practitioners and students from all around the world, helping them to share ideas, and to expand networks for scholars. AED is an international conference that focuses on Sustainability and how it is approached by Architectural and Environmental Designs. AED engages with real life problems that affect the buildings on all scales, cities, and environment where it also discusses the built environment, and the factors that assist in shaping the built environment and how it affects our lives and our activities. IEREK for International Experts for Research Enrichment and Knowledge Exchange welcomes the abstract submissions to our Early Career conference. This conference will give early career researchers the chance to socialize, collaborate and communicate with others working in Architecture and Environmental Design. The conference will bring together participants to present and discuss their work and ideas in a welcoming interactive environment. Participants will receive feedback, new ideas, and will learn how to decisively develop their profiles to help with their career advancements, and with the chance of getting their papers.',
  'Africa needs new infrastructure. Roads, airports, schools, hospitals and housing: the list is enormous and growing. Yet severely limited budgets and deficits continue to prevent government at all levels from delivering the kinds of structural change that has always been needed. Merely grasping the concepts of PPP does not do justice to our great responsibility of having an ownership in Africa’s future. We already know what we need to do, now is the time to really discover HOW. This master class aims to do just that. Beginning with an in-depth understanding of how PPPs work, from financial, commercial, project & legal aspects, we seek to push our participants to innovate with real life case studies, group discussions and technical evaluation. Experience how theoretical concepts works in practice with educational field visit to one of Africa\'s largest PPP projects, the Gautrain Project, on 24 August. A distinguished guest speaker from Gautrain Management Agency, South Africa, will share their real life challenges and solutions for PPP projects too!',
  'The biennial \'Aachener Membran Kolloquium\' (AMK), organised by the Chair of Chemical Process Engineering at RWTH Aachen University, is one of the leading international conferences on industrial applications of membrane technology. While most other conferences tend to focus much on materials science and others specialize on specific membrane technologies, the AMK tries to bring together people from a broad range of backgrounds with the aim of interdisciplinary knowledge exchange on membrane innovations. The topics of the presentations will be a well-balanced mixture discussing membranes in water treatment, gas separation, solvent recovery, process engineering, energy applications, biotechnology and health. The development of new membranes will be treated as well as operational experiences and module design with an emphasis on industrial relevance. The lecture program will be accompanied by a sizeable industrial exhibition, a large number of posters and time for valuable discussion.',
  'Due to the complex geopolitical nature of gas/LNG sourcing and long term nature of gas transactions between buyers and sellers, it is commercially prudent for those involved in this process to know the global gas/LNG supply situation, available methodologies for price determination, contract structure and negotiation techniques. Any misjudgement in any of these areas could result in wrong sourcing decisions, significant adverse financial consequences and legal liabilities. This course has, therefore, been designed to enable the professionals in the gas sector and gas advisory services to make right sourcing decision, construct gas/LNG contracts and negotiate from a position of strength and knowledge in order to gain a competitive edge in the process',
  'SMi is delighted to announce the return of the 9th Annual Air Mission Planning and Support conference taking place in April 2018. The Air Mission Support market is active and operationally relevant as ever. With an aversion from placing boots on the ground in combat zones such as Syria and Iraq, air power is increasingly relied upon to project force. Commanders and procurers of air assets continue to seek means of enhancing the combat effectiveness of their platforms. To do so, effective mission planning, real time support, and de-briefing is required. SMi’s conference will explore the technology and strategies necessary to take Air Mission Planning into the next generation, providing agile end to end mission support to air crews. An examination of emerging technologies in these key areas, presented by industry and research leaders shall be combined with operational case studies and key programme updates from commanders and military project leaders, to develop key requirements and solutions for enhancing air mission planning and execution. Be a part of this unique event where you will get the opportunity to discuss with leading experts in the field from NATO, Jordan, US, United Kingdom, Sweden, Norway, Belgium, the Netherlands, and many more!',
  'Protecting the environment is a global priority and it is as urgent in the Middle East and North Africa region as it is anywhere else in the world. While short-term thinking has often meant that economic growth has taken place to the detriment of the natural environment, there is a rising call for a change in mindset, advancing the notion that the economy and the environment go hand in hand. This event will convene business leaders, policymakers, scientists, academics, and investors, to offer them concrete strategies and ideas to help them to prepare for the future, and scale up their efforts towards ensuring sustainability. How can regional policymakers apply lessons learnt across the globe to their country’s sustainability plans? What must business leaders do to scale up action from responsibility to leadership? What role does the financial industry have to play in encouraging green investment? What research is needed to stimulate eco-innovation, and how can scientific evidence and models facilitate better decision making? We will be discussing these topics and many more during the forum.',
  'World leading research is dependent upon collaboration and co-operation. It is becoming increasingly recognised that the relationship between lengthscales and biocompatibility encompasses the future of the biomaterials and bio-inspired structures. Therefore, the diversity in processing methods, biological features and imaging techniques that feed into this subject create an unusual combination of skill sets and understanding. Here we aim to merge the boundaries between these fields and create a platform for learning and dissemination of the latest research. The 9th International Workshop on Interfaces: New Frontiers in Biomaterials intends to showcase this intersection of subjects that lead to the fabrication of materials with complex functionalities that draw inspiration from nature. It wishes to bring together the 1st Biobone Symposion and the previous editions of the Workshop on Interfaces, continuing to provide a multi-disciplinary  platform where both early stage researchers and world leading academics can engage with and learn from each other.'
];

const eventsToSeed = _.times(60, (n) => ({
  id: n + 1,
  title: faker.random.arrayElement(eventsNames),
  categoryId: faker.random.number({ min: 1, max: 8 }),
  userId: faker.random.number({ min: 1, max: 10 }),
  address: `${faker.address.country()}, ${faker.address.city()}, ${faker.address.streetAddress()}`,
  location: JSON.stringify({
    lat: Number(faker.address.latitude()),
    lng: Number(faker.address.longitude())
  }),
  description: faker.random.arrayElement(descriptions),
  date: faker.date.between(new Date('May 20, 2018 03:24:00'), new Date('December 30, 2018 03:24:00')),
  createdAt: new Date(),
  updatedAt: new Date()
}));

eventsToSeed.push(eventForTests);

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Events', eventsToSeed, {}),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Events', eventsToSeed, {})
};