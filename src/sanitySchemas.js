// Sanity schema definitions
// This file should be placed in your Sanity studio's schema folder

export const chefMenuSchema = {
  name: "chefMenu",
  title: "Chef Menu",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Chef Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "question1",
      title: "Question 1 (Percentage)",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Question Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "type",
          title: "Question Type",
          type: "string",
          initialValue: "percentage",
          readOnly: true,
          hidden: true,
        },
        {
          name: "min",
          title: "Min Value",
          type: "number",
          initialValue: 0,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "max",
          title: "Max Value",
          type: "number",
          initialValue: 100,
          validation: (Rule) => Rule.required(),
        },
        {
          name: "default",
          title: "Default Value",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
    {
      name: "question2",
      title: "Question 2 (Single Choice)",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Question Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "type",
          title: "Question Type",
          type: "string",
          initialValue: "single-choice",
          readOnly: true,
          hidden: true,
        },
        {
          name: "options",
          title: "Options",
          type: "array",
          of: [{ type: "string" }],
          validation: (Rule) => Rule.required().min(4).max(4),
        },
      ],
    },
    {
      name: "question3",
      title: "Question 3 (Range)",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Question Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "type",
          title: "Question Type",
          type: "string",
          initialValue: "range",
          readOnly: true,
          hidden: true,
        },
        {
          name: "min",
          title: "Min Value",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "max",
          title: "Max Value",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "default",
          title: "Default Value",
          type: "number",
          validation: (Rule) => Rule.required(),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      order: "order",
    },
    prepare(selection) {
      const { title, order } = selection;
      return {
        title: title,
        subtitle: `Order: ${order}`,
      };
    },
  },
};

export const orderSchema = {
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    {
      name: "customer",
      title: "Customer",
      type: "object",
      fields: [
        {
          name: "name",
          title: "Name",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "email",
          title: "Email",
          type: "string",
          validation: (Rule) => Rule.required().email(),
        },
      ],
    },
    {
      name: "order",
      title: "Order Details",
      type: "object",
      fields: [
        {
          name: "chefId",
          title: "Chef ID",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "chefTitle",
          title: "Chef Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "answers",
          title: "Answers",
          type: "object",
          fields: [
            {
              name: "question1",
              title: "Question 1 Answer",
              type: "number",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "question2",
              title: "Question 2 Answer",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "question3",
              title: "Question 3 Answer",
              type: "number",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      name: "customer.name",
      chef: "order.chefTitle",
      createdAt: "_createdAt",
    },
    prepare(selection) {
      const { name, chef, createdAt } = selection;
      return {
        title: `${name} - ${chef}`,
        subtitle: new Date(createdAt).toLocaleDateString(),
      };
    },
  },
};
