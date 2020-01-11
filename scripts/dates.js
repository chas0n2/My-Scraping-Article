const createDate = function() {
    const d = new Date();
    const FD = "";

    FD += (d.getMonth() + 1) + "_";
    FD += d.getDate() + "_";
    FD +=d.getFullYear();

    return FD;

};
module.exports = createDate;