const errorHandler = (err, req, res, next) => {
    console.error("=== ERROR OCCURRED ===");
    console.error("Timestamp:", new Date().toISOString());
    console.error("Request:", req.method, req.path);
    console.error("Query params:", JSON.stringify(req.query, null, 2));
    console.error("Request body:", JSON.stringify(req.body, null, 2));
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);

    let statusCode = 500;
    let errorMessage = "Internal server error";
    let errorDetails = {};

    // Handle different types of errors
    if (err.name === "ValidationError") {
        console.error("=== MONGOOSE VALIDATION ERROR ===");
        statusCode = 400;
        errorMessage = "Validation failed";

        const validationErrors = {};
        Object.keys(err.errors).forEach((key) => {
            validationErrors[key] = err.errors[key].message;
            console.error(`  Field '${key}': ${err.errors[key].message}`);
            console.error(`  Value: ${JSON.stringify(err.errors[key].value)}`);
            console.error(`  Path: ${err.errors[key].path}`);
        });
        errorDetails = { validationErrors };
    } else if (err.code === 11000) {
        console.error("=== DUPLICATE KEY ERROR ===");
        statusCode = 400;
        errorMessage = "Duplicate entry found";

        const duplicateField = Object.keys(err.keyPattern || {})[0];
        const duplicateValue = err.keyValue
            ? err.keyValue[duplicateField]
            : "unknown";

        console.error("Duplicate field:", duplicateField);
        console.error("Duplicate value:", duplicateValue);
        console.error("Key pattern:", err.keyPattern);

        errorDetails = {
            field: duplicateField,
            value: duplicateValue,
            message: `${duplicateField} '${duplicateValue}' already exists`,
        };
    } else if (err.name === "CastError") {
        console.error("=== CAST ERROR (Invalid ID/Type) ===");
        statusCode = 400;
        errorMessage = "Invalid data format";

        console.error("Cast error path:", err.path);
        console.error("Cast error value:", err.value);
        console.error("Cast error kind:", err.kind);

        errorDetails = {
            field: err.path,
            value: err.value,
            expectedType: err.kind,
            message: `Invalid ${err.kind} format for field '${err.path}'`,
        };
    } else if (err.name === "MongoServerError" || err.name === "MongoError") {
        console.error("=== MONGODB SERVER ERROR ===");
        console.error("MongoDB error code:", err.code);
        console.error("MongoDB error codeName:", err.codeName);

        // Handle specific MongoDB error codes
        switch (err.code) {
            case 2:
                statusCode = 400;
                errorMessage = "Invalid data format (BadValue)";
                console.error("BadValue error - check data types in request");
                console.error("Error details:", err.errmsg || err.message);
                errorDetails = {
                    mongoCode: err.code,
                    mongoCodeName: err.codeName,
                    message: "Invalid data type or format provided",
                    hint: "Check that all fields match expected data types",
                };
                break;

            case 121:
                statusCode = 400;
                errorMessage = "Document validation failed";
                errorDetails = {
                    mongoCode: err.code,
                    message: "Document does not match schema validation rules",
                };
                break;

            default:
                statusCode = 500;
                errorMessage = "Database operation failed";
                errorDetails = {
                    mongoCode: err.code,
                    mongoCodeName: err.codeName,
                };
        }
    } else if (err.name === "JsonWebTokenError") {
        console.error("=== JWT ERROR ===");
        statusCode = 401;
        errorMessage = "Invalid authentication token";
    } else if (err.status) {
        statusCode = err.status;
        errorMessage = err.message;
    }

    // Log the full error stack in development
    if (process.env.NODE_ENV === "development") {
        console.error("Error stack:", err.stack);
        console.error("Full error object:", err);
    }

    console.error("=== END ERROR ===");

    // Send response
    const response = {
        success: false,
        message: errorMessage,
        ...(Object.keys(errorDetails).length > 0 && { details: errorDetails }),
    };

    // Include full error in development
    if (process.env.NODE_ENV === "development") {
        response.debug = {
            name: err.name,
            message: err.message,
            stack: err.stack,
        };
    }

    return res.status(statusCode).json(response);
};

module.exports = errorHandler;
