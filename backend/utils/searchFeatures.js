class SearchFeatures {
    /**
     * @param {Object} query - MongoDB query object (e.g., Product.find())
     * @param {Object} queryString - URL query parameters (req.query)
     */
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * Search Feature: Keyword ke base par products dhoondta hai
     * Includes Regex Escape Fix to prevent backend crash on special characters like ( [ {
     */
    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                // Special characters ko escape karta hai taake regex invalid na ho
                $regex: this.queryString.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
                $options: "i", // Case-insensitive search
            }
        } : {};

        this.query = this.query.find({ ...keyword });
        return this;
    }

    /**
     * Filter Feature: Category, Price, aur Ratings ke liye
     */
    filter() {
        // Query ki copy banate hain taake original queryStr change na ho
        const queryCopy = { ...this.queryString };

        // Search aur Pagination ke fields ko filter se remove karte hain
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);

        // Price Filter Logic:
        // Input: { price: { gte: '100', lte: '500' } }
        // Output: { price: { $gte: '100', $lte: '500' } }
        let queryString = JSON.stringify(queryCopy);
        
        // MongoDB operators ($gt, $gte, etc.) ke aage '$' symbol lagana
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }

    /**
     * Pagination Feature: Result ko pages mein divide karta hai
     * @param {Number} resultPerPage - Ek page par kitne products dikhane hain
     */
    pagination(resultPerPage) {
        // Default current page 1 rahega
        const currentPage = Number(this.queryString.page) || 1;

        // Skip logic: Agar page 2 par hain toh pehle 'resultPerPage' products skip honge
        const skipProducts = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skipProducts);
        return this;
    }
}

module.exports = SearchFeatures;