import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatInfoRequest, ChatRequest, Notification } from 'src/chat.interface';
import { Chat, ChatImage, ChatInfo } from 'src/chat.schema';

export class ChatRepository {
  constructor(
    @InjectModel('chat') private readonly chat: Model<Chat>,
    @InjectModel('chat-info') private readonly chatInfo: Model<ChatInfo>,
    @InjectModel('chat-image') private readonly chatImage: Model<ChatImage>,
    @InjectModel('notification') private readonly notification: Model<Notification>,
  ) { }
  async chatChecked() {
    return 'Chat service is up and running!';
  }
  async getCountChatDetail(idChat: string, type: 'chat' | 'chatImage' | 'notification') {
    const data = await this[type].aggregate(
      [{ $match: { idChat: idChat } }, { $count: 'count' }],
    );
    return data;
  }
  async createChat(data: ChatInfoRequest) {
    const getChatInfo = await this.chatInfo.find({ user: data.user }).exec();
    if (getChatInfo.length > 0) {
      return getChatInfo[0];
    }
    const chatInfo = await this.chatInfo.create(data);
    return chatInfo;
  }
  async chatInsert(data: ChatRequest) {
    const chat = this.chat.create(data);
    return chat;
  }
  async notiInsert(data: Notification) {
    const noti = this.notification.create(data);
    return noti;
  }
  async getNotiByChatId(idChat: string, page: number, limit: number) {
    const data = await this.notification.aggregate([
      { $match: { idChat: idChat } },
      { $sort: { date: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
    return data;
  }
  async userLeaveGroupChat(idUser: string, id: string) {
    return await this.chatInfo.findByIdAndUpdate(id, {
      $pull: { user: idUser },
    });
  }
  async getChatByUser(idUser: string) {
    const data = await this.chatInfo.aggregate([
      {
        $match: { user: { $in: [idUser] } },
      },
      {
        $lookup: {
          from: 'chat',
          localField: '_id',
          foreignField: 'idChat',
          as: 'lastMessage',
        },
      },
      {
        $addFields: {
          userAction: {
            $filter: {
              input: '$userAction',
              as: 'action',
              cond: { $eq: ['$$action.idUser', idUser] },
            },
          },
        },
      },
      {
        $addFields: {
          deleteDate: {
            $arrayElemAt: ['$userAction.date', 0],
          },
        },
      },
      {
        $addFields: {
          lastMessage: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$lastMessage',
                  as: 'message',
                  cond: {
                    $cond: {
                      /*if type chat is group
                                            => check delete date
                                                => if delete date is not null => get the lasted message before delete date
                                                => if delete date is null => get the lasted message after delete date
                                        */
                      //if owner remove user => delete date is not null and get the lasted message before delete date
                      if: { $eq: ['$type', 'group'] },
                      then: {
                        $gte: ['$$message.date', '$deleteDate'],
                        // $cond: {
                        //     //if delete date is not null => get the lasted message before delete date
                        //     if: { $ne: ['$deleteDate', null] },
                        //     then: { $lt: ['$$message.date', '$deleteDate'] },
                        //     else: { $gte: ['$$message.date', '$deleteDate'] }
                        // }
                      },
                      /*if type chat is not group
                        => get the lasted message after delete date
                      */
                      else: { $gte: ['$$message.date', '$deleteDate'] },
                    },
                  },
                },
              },
              -1,
            ],
          },
        },
      },
      // add field sort
      {
        $addFields: {
          sortField: {
            $cond: {
              if: { $eq: ['$lastMessage', null] }, // if lastMessage is null
              then: '$created_at', // get created_at from chatInfo
              else: '$lastMessage.date', // get date from lastMessage
            },
          },
        },
      },
      { $sort: { sortField: -1, _id: -1 } }, //sorted by created_at or lastMessage.date and _id
      {
        $project: {
          _id: 1,
          name: 1,
          avatar: 1,
          user: 1,
          lastMessage: 1,
          userAction: 1,
          notification: 1,
          type: 1,
          deleteDate: 1,
          owner: 1
        },
      },
    ]);
    return data;
  }
  async getChatDetail(idUser: string, id: string, page: number, limit: number) {
    const getInfo = await this.chatInfo.findOne({ _id: id }).exec();
    const dateFilter = getInfo.userAction.filter(
      (item: any) => item.idUser === idUser,
    )[0];
    const filterValue = dateFilter.date
      ? { idChat: id, date: { $gte: dateFilter.date } }
      : { idChat: id };
    const getItem = await this.chat
      .find(filterValue)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return getItem.reverse();
  }
  async getChatImageById(
    idUser: string,
    id: string,
    page: number,
    limit: number,
  ) {
    const getInfo = await this.chatInfo.findOne({ _id: id }).exec();
    const dateFilter = getInfo.userAction.filter(
      (item: any) => item.idUser === idUser,
    )[0];
    const objDate =
      getInfo.type === 'group'
        ? { $lte: dateFilter.date }
        : { $gte: dateFilter.date };
    const filterValue = dateFilter.date
      ? { idChat: id, date: objDate }
      : { idChat: id };
    const data = await this.chatImage
      .find(filterValue)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return data;
  }
  async getChatDetailInfo(idChat: string) {
    const data = await this.chatInfo.findById(
      { _id: idChat },
      {
        _id: 1,
        name: 1,
        avatar: 1,
        user: 1,
        time: 1,
        type: 1,
        notification: 1,
        owner: 1,
        userAction: 1,
      },
    );
    return data;
  }
  async chatUpdate(
    _id: string,
    data: { [key: string]: string | number | boolean | any },
  ) {
    const update = await this.chat.findByIdAndUpdate(_id, data);
    if (!update) {
      return false;
    }
    return update;
  }
  async chatInfoUpdate(
    _id: string,
    data: { [key: string]: string | number | boolean | [] | any },
  ) {
    return await this.chatInfo.findByIdAndUpdate(_id, data);
  }
  async chatImages(data: ChatImage[]) {
    const insert = await this.chatImage.insertMany(data);
    return insert;
  }
}
