const { default: mongoose } = require('mongoose');
const ModuleGroup = require('../models/ModuleGroupModel');

// {
//     "name": "User Management",
//     "priority": 2,
//     "actions": [
//         {
//             "name": "View User Management",
//             "priority": 1
//         },
//         {
//             "name": "Edit User Management",
//             "priority": 2
//         },
//         {
//             "name": "Add User Management",
//             "priority": 3
//         },
//         {
//             "name": "Delete User Management",
//             "priority": 4
//         }
//     ]
// }
exports.createModuleGroup = async (req, res) => {
    try {
        const { name, actions, priority } = req.body;
        const newModuleGroup = new ModuleGroup();
        newModuleGroup.name = name;
        const slugData = name.replace(/\s+/g, '-').replace(/[&\/\\@#,+()$~%.'":*?<>{}]/g, '').toLowerCase();
        newModuleGroup.slug = await validateSlug(slugData);
        newModuleGroup.priority = priority;
        const actionsDatas = await Promise.all(actions.map(async (value) => {
            const temp = {};
            temp.name = value.name;
            temp.priority = value.priority;
            const actionSlugData = value.name.replace(/\s+/g, '-').replace(/[&\/\\@#,+()$~%.'":*?<>{}]/g, '').toLowerCase();
            temp.slug = await validateActionSlug(actionSlugData);
            return temp;
        }));
        newModuleGroup.actions = actionsDatas;
        await newModuleGroup.save();
        return res.status(200).send({
            sts: 0,
            msg: 'The module group has been created successfully',
        })
    } catch (err) {
        console.log(err, 'errerr');
        return res.status(500).send({
            sts: 1,
            msg: 'Serer Error',
            error: err.messages,
        })
    }
}

exports.getModuleGroup = async (req, res) => {
    try {
        const data = await ModuleGroup.aggregate([
            { $sort: { priority: 1 } },
            {
                $addFields: {
                    actions: { $sortArray: { input: "$actions", sortBy: { priority: 1 } } }
                }
            }
        ]);
        return res.status(200).send({
            sts: 1,
            msg: 'Success',
            data,
        })
    } catch (err) {
        console.log(err, 'errerr');
        return res.status(500).send({
            sts: 1,
            msg: 'Serer Error',
            error: err.messages,
        })
    }
}

const validateSlug = async (slug, _id = '', count = 0) => {
    const filter = { slug };

    if (_id) {
        filter._id = { $ne: new mongoose.Types.ObjectId(_id) };
    }

    const findSlug = await ModuleGroup.findOne(filter);

    if (findSlug) {
        count += 1;
        return validateSlug(`${slug}${count}`, _id, count);
    } else {
        return slug;
    }
};

const validateActionSlug = async (slug, _id = '', count = 0) => {
    const filter = { 'actions.slug': slug };
    if (_id) {
        filter._id = { $ne: new mongoose.Types.ObjectId(_id) };
    }

    const findSlug = await ModuleGroup.findOne(filter);

    if (findSlug) {
        count += 1;
        return validateSlug(`${slug}${count}`, _id, count);
    } else {
        return slug;
    }
}
