const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    let errs = {};
    if (eventType === '') errs.eventType = 'You must pick a type';
    if (eventPrivate === '') errs.eventPrivate = 'Visibility type is required';
    if (name === '') errs.name = 'You must give your event a name';


    if (price){
        let price1 = price.split('.');
        if ((price1[1]&&(isNaN(price1[1])||price1[1].length > 2)) || Number(price1[0]) < 0 || isNaN(price1[0])) errs.price = 'Please provide a valid price';
    } else errs.price = 'Please provide a valid price';


    if (name.length > 30) errs.name = `Your event's name can't exceed 30 characters in length`;
    if (description === '') errs.description = 'Please tell us about your event: Description must be at least 50 characters in length';
    if (description.length < 50) errs.description = 'Please be more descriptive about your event: Description must be at least 50 characters in length';


    let start1;
    let startCont = true;
    try {
        start1 = new Date(start);
    } catch {
        errs.start = 'Please provide a valid date';
        startCont = false;
    }
    let start2;
    if (startCont) {
        start2 = start1.getTime();
        let now = new Date();
        now = now.getTime();
        if (!(start2 > now)) {
            errs.start = 'Start date must be in the future';
            startCont = false;
        }
    }


    let end1;
    let endCont = true;
    try {
        end1 = new Date(end);
    } catch {
        errs.end = 'Please provide a valid end date';
        endCont = false;
    }
    let end2;
    if (startCont && endCont) {
        end2 = end1.getTime();
        if (!(end2 > start2)) errs.end = 'End date must be after the start date';
    }


    if (image === '') errs.image = 'You must provide an image';
    else {
        let invalidImage = true;
        ['.png', '.jpg', '.jpeg'].forEach(end => { if (image.endsWith(end)) invalidImage = false });
        if (invalidImage) errs.image = 'Image URL must end with .png, .jpg, or .jpeg';
    }
    if (Object.values(errs).length) return setErrors(errs);


    let event = {
        venueId: 2,
        name,
        type: eventType,
        capacity: 10,
        price,
        description,
        startDate: start,
        endDate: end,
        groupId
    };
    const newEvent = await dispatch(createEvent(event, image));
    history.push(`/events/${newEvent.id}`);
}


const validateEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .withMessage('VenueId is required')
        .custom(async (value, { req }) => {
            const venue = await Venue.findByPk(parseInt(req.body.venueId))

            if (!venue) {
                throw new Error('Venue does not exist');
            }
        })
        .withMessage('Venue does not exist'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters')
    ,
    check('type')
        .exists({ checkFalsy: true })
        .withMessage('State is required')
        .custom((value, { req }) => {
            return value === "Online" || value === "In person"
        })
        .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Price must be decimal')
        .custom(async (price, { req }) => {
            price = price.toString()
            price = price.toString().split('.');
            if (price[1].length > 2 || Number(price[0]) < 0)
                throw new Error('Please provide a valid price')
        }),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check('startDate')
        .isAfter()
        .withMessage("Start date must be in the future"),
    check('endDate')
        .isAfter()
        .custom((value, { req }) => {
            return value > req.body.startDate
        })
        .withMessage('End date is less than start date'),

    handleValidationErrors
];
