import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple()
);

const loggerRoot = winston.createLogger({
  level: "silly",
  format: logFormat,
  defaultMeta: { service: "catch-api" },
  transports: [
    new winston.transports.Console(),
    //new winston.transports.File({ filename: 'combined.log' })
  ],
});

const loggerBusiness = winston.createLogger({
  level: "silly",
  format: logFormat,
  defaultMeta: { service: "catch-business" },
  transports: [
    new winston.transports.Console(),
    //new winston.transports.File({ filename: 'combined.log' })
  ],
});

const loggerIndividual = winston.createLogger({
  level: "silly",
  format: logFormat,
  defaultMeta: { service: "catch-individual" },
  transports: [
    new winston.transports.Console(),
    //new winston.transports.File({ filename: 'combined.log' })
  ],
});

const loggerAdmin = winston.createLogger({
  level: "silly",
  format: logFormat,
  defaultMeta: { service: "catch-admin" },
  transports: [
    new winston.transports.Console(),
    //new winston.transports.File({ filename: 'combined.log' })
  ],
});

export { loggerRoot, loggerAdmin, loggerBusiness, loggerIndividual };
