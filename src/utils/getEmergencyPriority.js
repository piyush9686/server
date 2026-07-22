const getEmergencyPriority = (type) => {

    const priorities = {

        medical: "critical",

        fire: "critical",

        theft: "high",

        accident: "high",

        missing_person: "medium",

        suspicious_activity: "low",

    };

    return priorities[type] || "medium";

};

export default getEmergencyPriority;