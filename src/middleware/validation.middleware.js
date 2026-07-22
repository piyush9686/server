// export const validate = (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({
//         success: false,
//         message: error.details[0].message,
//       });
//     }

//     next();
//   };
// };

import { validationResult } from "express-validator";

export const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        console.log("❌ VALIDATION ERRORS:");
        console.log(errors.array());

        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });

    }

    next();

};