const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
};

const option = {
    day: "numeric",
};

const dd = new Date();
const send = dd.toLocaleString("en-US", options);
const sendd = dd.toLocaleString("en-US", option);

module.exports.original=send;
module.exports.duplicate=sendd;