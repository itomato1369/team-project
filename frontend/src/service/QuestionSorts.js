export const QuestionSort = {
  getData() {
    return [
      { name: '문의', code: 'questions' },
      { name: '이의제기', code: 'complain' },
    ];
  },

  getQuestionSorts() {
    return Promise.resolve(this.getData());
  },
};
