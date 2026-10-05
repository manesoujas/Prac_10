import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        // Check if exists
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ success: false, message: 'Category already exists' });
        }

        const category = await Category.create({ name, description, icon });
        res.status(201).json({ success: true, data: category, message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: updatedCategory, message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
